(function (globalScope) {
  function normalizeVariant(rawVariant) {
    if (typeof rawVariant !== 'string') {
      return 'A';
    }

    var normalized = rawVariant.trim().toUpperCase();
    return normalized || 'A';
  }

  function buildVariantStorageKey(testKey) {
    return 'ab_variant:' + String(testKey || '').trim();
  }

  function getStoredVariant(storageRef, testKey, legacyStorageKey) {
    var scopedStorageKey = buildVariantStorageKey(testKey);
    var fallbackKey = legacyStorageKey || 'ab_variant';

    try {
      var scopedValue = storageRef && storageRef.getItem(scopedStorageKey);

      if (scopedValue) {
        return normalizeVariant(scopedValue);
      }

      return normalizeVariant(storageRef && storageRef.getItem(fallbackKey));
    } catch (error) {
      return 'A';
    }
  }

  function setStoredVariant(storageRef, testKey, variant, legacyStorageKey) {
    var normalizedVariant = normalizeVariant(variant);
    var scopedStorageKey = buildVariantStorageKey(testKey);
    var fallbackKey = legacyStorageKey || 'ab_variant';

    if (!storageRef || typeof storageRef.setItem !== 'function') {
      return normalizedVariant;
    }

    try {
      storageRef.setItem(scopedStorageKey, normalizedVariant);
      storageRef.setItem(fallbackKey, normalizedVariant);
    } catch (error) {
      // Ignore storage write failures so tracking can continue safely.
    }

    return normalizedVariant;
  }

  function buildTrackingPayload(options) {
    return {
      event: options.event,
      test_key: options.testKey,
      variant: normalizeVariant(options.variant),
      page_path: options.pagePath,
      page_url: options.pageUrl,
      timestamp: options.timestamp || 'NOW'
    };
  }

  function createAbTracker(config) {
    var endpoint = config.endpoint;
    var fetchImpl = config.fetchImpl || (globalScope.fetch ? globalScope.fetch.bind(globalScope) : null);
    var locationRef = config.location || globalScope.location || { pathname: '/', href: '' };
    var navigatorRef = config.navigator || globalScope.navigator || null;
    var storageRef = config.storage || globalScope.localStorage || null;
    var storageKey = config.storageKey || 'ab_variant';

    function getVariant() {
      if (config.variant) {
        return normalizeVariant(config.variant);
      }

      return getStoredVariant(storageRef, config.testKey, storageKey);
    }

    function setVariant(variant) {
      return setStoredVariant(storageRef, config.testKey, variant, storageKey);
    }

    function send(payload) {
      var body = JSON.stringify(payload);

      if (navigatorRef && typeof navigatorRef.sendBeacon === 'function') {
        try {
          var blob = new Blob([body], { type: 'application/json' });
          if (navigatorRef.sendBeacon(endpoint, blob)) {
            return Promise.resolve({ queued: true });
          }
        } catch (error) {
          // Fall through to fetch keepalive below.
        }
      }

      if (!fetchImpl) {
        return Promise.resolve({ queued: false });
      }

      return fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body,
        keepalive: true
      }).catch(function () {
        return { queued: false };
      });
    }

    function track(eventName, extra) {
      if (!endpoint || !config.testKey) {
        return Promise.resolve({ queued: false });
      }

      var payload = buildTrackingPayload({
        event: eventName,
        testKey: config.testKey,
        variant: extra && extra.variant ? extra.variant : getVariant(),
        pagePath: extra && extra.pagePath ? extra.pagePath : locationRef.pathname,
        pageUrl: extra && extra.pageUrl ? extra.pageUrl : locationRef.href,
        timestamp: new Date().toISOString()
      });

      if (extra && extra.metadata) {
        payload.metadata = extra.metadata;
      }

      return send(payload);
    }

    return {
      buildTrackingPayload: buildTrackingPayload,
      getVariant: getVariant,
      setVariant: setVariant,
      track: track
    };
  }

  var api = {
    buildVariantStorageKey: buildVariantStorageKey,
    buildTrackingPayload: buildTrackingPayload,
    createAbTracker: createAbTracker,
    getStoredVariant: getStoredVariant,
    normalizeVariant: normalizeVariant,
    setStoredVariant: setStoredVariant
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.JiyuAbTracking = api;
})(typeof window !== 'undefined' ? window : globalThis);
