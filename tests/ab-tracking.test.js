const assert = require('node:assert/strict');

const {
  buildTrackingPayload,
  createAbTracker,
  getStoredVariant,
  normalizeVariant,
} = require('../ab-tracking.js');

assert.equal(normalizeVariant('b'), 'B');
assert.equal(normalizeVariant(''), 'A');
assert.equal(normalizeVariant(null), 'A');

assert.deepEqual(
  buildTrackingPayload({
    event: 'page_view',
    testKey: 'jiyu_headline_v1',
    variant: 'b',
    pagePath: '/product',
    pageUrl: 'https://tryglow.soulalchemy528.com/product',
  }),
  {
    event: 'page_view',
    test_key: 'jiyu_headline_v1',
    variant: 'B',
    page_path: '/product',
    page_url: 'https://tryglow.soulalchemy528.com/product',
    timestamp: 'NOW',
    user_agent: '',
  },
  'Tracking payload should normalize the variant and keep the page context intact, including the browser user agent.',
);

console.log('ab-tracking.test.js passed');

(async () => {
  const storage = {
    values: new Map(),
    getItem(key) {
      return this.values.has(key) ? this.values.get(key) : null;
    },
    setItem(key, value) {
      this.values.set(key, String(value));
    },
  };

  const queuedPayloads = [];
  const trackerWithFreshVisitor = createAbTracker({
    endpoint: 'https://example.com/api/ab-track',
    fetchImpl(url, options) {
      queuedPayloads.push({
        url,
        body: JSON.parse(options.body),
      });
      return Promise.resolve({ ok: true, status: 200 });
    },
    location: {
      href: 'https://tryglow.soulalchemy528.com/',
      pathname: '/',
    },
    navigator: {
      userAgent: 'UnitTestBrowser/1.0',
    },
    randomImpl() {
      return 0.75;
    },
    storage,
    testKey: 'jiyu_headline_v1',
  });

  assert.equal(
    trackerWithFreshVisitor.getVariant(),
    'B',
    'Fresh visitors should be assigned randomly 50/50 the first time the tracker resolves a variant.',
  );

  assert.equal(
    getStoredVariant(storage, 'jiyu_headline_v1'),
    'B',
    'Fresh visitors should keep that first random assignment in localStorage for later visits.',
  );

  await trackerWithFreshVisitor.track('page_view');

  assert.deepEqual(
    queuedPayloads[0] && queuedPayloads[0].body,
    {
      event: 'page_view',
      test_key: 'jiyu_headline_v1',
      variant: 'B',
      page_path: '/',
      page_url: 'https://tryglow.soulalchemy528.com/',
      timestamp: queuedPayloads[0].body.timestamp,
      user_agent: 'UnitTestBrowser/1.0',
    },
    'Tracked events should include the sticky variant and browser user agent.',
  );

  const tracker = createAbTracker({
    endpoint: 'https://example.com/api/ab-track',
    fetchImpl() {
      return Promise.resolve({ ok: false, status: 404 });
    },
    location: {
      href: 'https://tryglow.soulalchemy528.com/',
      pathname: '/',
    },
    navigator: {
      userAgent: 'UnitTestBrowser/1.0',
    },
    storage: {
      getItem() {
        return 'B';
      },
    },
    testKey: 'jiyu_headline_v1',
  });

  assert.deepEqual(
    await tracker.track('page_view'),
    { queued: false, ok: false, status: 404 },
    'HTTP failures should resolve cleanly so analytics never breaks the landing page.',
  );

  console.log('ab-tracking failure handling passed');
})();
