const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createStorage(initialValues) {
  const store = new Map(Object.entries(initialValues || {}));

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

function createClassList(initialClasses) {
  const classes = new Set(initialClasses || []);

  return {
    add(value) {
      classes.add(value);
    },
    remove(value) {
      classes.delete(value);
    },
    contains(value) {
      return classes.has(value);
    },
    toggle(value, force) {
      if (typeof force === 'boolean') {
        if (force) {
          classes.add(value);
        } else {
          classes.delete(value);
        }
        return force;
      }

      if (classes.has(value)) {
        classes.delete(value);
        return false;
      }

      classes.add(value);
      return true;
    },
  };
}

function createElement(options) {
  const listeners = new Map();
  const attributes = new Map();
  const element = {
    classList: createClassList(options && options.classes),
    clientHeight: 0,
    clientWidth: 0,
    dataset: Object.assign({}, options && options.dataset),
    disabled: Boolean(options && options.disabled),
    hidden: false,
    id: options && options.id ? options.id : '',
    innerHTML: '',
    offsetLeft: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    style: {},
    tagName: options && options.tagName ? options.tagName : 'div',
    textContent: options && options.textContent ? options.textContent : '',
    addEventListener(eventName, handler) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, []);
      }
      listeners.get(eventName).push(handler);
    },
    dispatch(eventName, event) {
      (listeners.get(eventName) || []).forEach((handler) => handler(event));
    },
    getAttribute(name) {
      return attributes.has(name) ? attributes.get(name) : null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    scrollBy() {},
    scrollIntoView() {},
    scrollTo() {},
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
  };

  if (options && options.href) {
    element.href = options.href;
  }

  return element;
}

async function bootLandingPage() {
  let domContentLoadedHandler = null;
  const headline = createElement({
    textContent: 'Renewal & Rejuvenation Toner Pads',
  });
  const addToCartBtn = createElement({
    classes: ['add-to-cart-btn'],
    dataset: {
      checkoutCta: '',
    },
    id: 'add-to-cart',
    tagName: 'button',
  });
  const storage = createStorage();
  const fetchCalls = [];
  const consoleCalls = [];
  const locationState = {
    href: 'https://tryglow.soulalchemy528.com/',
    pathname: '/',
  };

  const document = {
    body: {
      classList: createClassList(),
      style: {},
    },
    addEventListener(eventName, handler) {
      if (eventName === 'DOMContentLoaded') {
        domContentLoadedHandler = handler;
      }
    },
    getElementById(id) {
      if (id === 'add-to-cart') {
        return addToCartBtn;
      }

      return null;
    },
    querySelector(selector) {
      if (selector === '[data-ab-headline]') {
        return headline;
      }

      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-checkout-cta]') {
        return [addToCartBtn];
      }

      return [];
    },
  };

  const context = {
    Blob,
    console: {
      error(...args) {
        consoleCalls.push({ level: 'error', args });
      },
      info(...args) {
        consoleCalls.push({ level: 'info', args });
      },
      log(...args) {
        consoleCalls.push({ level: 'log', args });
      },
      warn(...args) {
        consoleCalls.push({ level: 'warn', args });
      },
    },
    document,
    fetch(url, options) {
      fetchCalls.push({
        url: String(url),
        options: options || null,
      });

      if (String(url).indexOf('supabase.co/rest/v1/ab_tests') !== -1) {
        return Promise.resolve({ ok: false });
      }

      return Promise.resolve({ ok: true, status: 200 });
    },
    globalThis: null,
    localStorage: storage,
    location: locationState,
    navigator: {
      userAgent: 'LandingPageTest/1.0',
    },
    Promise,
    setInterval() {
      return 1;
    },
    window: null,
  };

  context.window = context;
  context.globalThis = context;
  context.window.addEventListener = function () {};
  context.window.clearInterval = function () {};
  context.window.localStorage = storage;
  context.window.matchMedia = function () {
    return { matches: false };
  };
  context.window.requestAnimationFrame = function (handler) {
    handler();
  };
  context.window.setInterval = context.setInterval;
  context.window.setTimeout = function (handler) {
    handler();
  };
  context.window.innerWidth = 1280;
  context.window.IntersectionObserver = function () {
    return {
      observe() {},
    };
  };
  context.window.JiyuCheckoutRoutes = {
    resolveCheckoutUrl() {
      return 'https://checkout.example/variant';
    },
  };

  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '..', 'ab-tracking.js'), 'utf8'),
    context,
  );
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8'),
    context,
  );

  assert.equal(typeof domContentLoadedHandler, 'function');
  domContentLoadedHandler();
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
  }

  return {
    addToCartBtn,
    consoleCalls,
    fetchCalls,
    locationState,
    storage,
  };
}

(async () => {
  const page = await bootLandingPage();
  const trackingCallsAfterLoad = page.fetchCalls.filter((call) => (
    call.url === 'https://funnel-ab-dashboard.vercel.app/api/ab-track'
  ));

  assert.equal(
    trackingCallsAfterLoad.length,
    1,
    'Loading the landing page should send exactly one page_view tracking request.',
  );

  const pageViewPayload = JSON.parse(trackingCallsAfterLoad[0].options.body);

  assert.equal(pageViewPayload.event, 'page_view');
  assert.equal(pageViewPayload.test_key, 'jiyu_headline_v1');
  assert.match(pageViewPayload.variant, /^[AB]$/);
  assert.equal(pageViewPayload.page_url, 'https://tryglow.soulalchemy528.com/');
  assert.equal(pageViewPayload.page_path, '/');
  assert.equal(pageViewPayload.user_agent, 'LandingPageTest/1.0');
  assert.equal(
    page.storage.getItem('ab_variant'),
    pageViewPayload.variant,
    'The sticky variant should be mirrored to the stable localStorage key for later visits.',
  );

  let prevented = false;
  page.addToCartBtn.dispatch('click', {
    preventDefault() {
      prevented = true;
    },
  });
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
  }

  const trackingCallsAfterClick = page.fetchCalls.filter((call) => (
    call.url === 'https://funnel-ab-dashboard.vercel.app/api/ab-track'
  ));

  assert.equal(prevented, true, 'CTA handling should keep control of navigation during tracking.');
  assert.equal(
    trackingCallsAfterClick.length,
    2,
    'Clicking the main CTA should append one cta_click tracking request.',
  );

  const ctaPayload = JSON.parse(trackingCallsAfterClick[1].options.body);

  assert.equal(ctaPayload.event, 'cta_click');
  assert.equal(
    ctaPayload.variant,
    pageViewPayload.variant,
    'CTA clicks should reuse the same sticky A/B assignment as the initial page view.',
  );
  assert.equal(
    page.locationState.href,
    'https://checkout.example/variant',
    'CTA tracking should not block the normal checkout redirect.',
  );

  console.log('ab-event-flow.test.js passed');
})();
