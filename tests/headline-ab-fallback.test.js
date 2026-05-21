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

function createElement(textContent) {
  return {
    classList: {
      contains() {
        return false;
      },
      toggle() {},
    },
    dataset: {},
    hidden: false,
    offsetLeft: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
    style: {},
    tagName: 'div',
    textContent: textContent || '',
    addEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    setAttribute() {},
  };
}

async function runLandingScriptWithStorage(storage) {
  let domContentLoadedHandler = null;
  const headline = createElement('Renewal & Rejuvenation Toner Pads');
  const consoleCalls = [];

  const document = {
    body: {
      classList: {
        add() {},
        remove() {},
      },
      style: {},
    },
    addEventListener(eventName, handler) {
      if (eventName === 'DOMContentLoaded') {
        domContentLoadedHandler = handler;
      }
    },
    getElementById() {
      return null;
    },
    querySelector(selector) {
      return selector === '[data-ab-headline]' ? headline : null;
    },
    querySelectorAll() {
      return [];
    },
  };

  const context = {
    Blob,
    console: {
      info(...args) {
        consoleCalls.push({ level: 'info', args });
      },
      warn(...args) {
        consoleCalls.push({ level: 'warn', args });
      },
      log(...args) {
        consoleCalls.push({ level: 'log', args });
      },
      error(...args) {
        consoleCalls.push({ level: 'error', args });
      },
    },
    document,
    fetch() {
      return Promise.resolve({ ok: false });
    },
    globalThis: null,
    location: {
      href: 'https://tryglow.soulalchemy528.com/',
      pathname: '/',
    },
    localStorage: storage,
    navigator: {},
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
  context.window.requestAnimationFrame = function (handler) {
    handler();
  };
  context.window.setInterval = context.setInterval;
  context.window.setTimeout = function (handler) {
    handler();
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
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
  }

  return {
    consoleCalls,
    headline: headline.textContent,
    state: context.window.JiyuHeadlineAbState,
  };
}

(async () => {
  const result = await runLandingScriptWithStorage(createStorage({
    'ab_variant:jiyu_headline_v1': 'B',
  }));

  assert.notEqual(
    result.headline,
    'Renewal & Rejuvenation Toner Pads',
    'Variant B should render a non-control fallback headline when dashboard read access is unavailable.',
  );

  assert.equal(
    result.state && result.state.variant_key,
    'B',
    'The landing page should publish the resolved variant state on window for debugging.',
  );

  assert.equal(
    result.consoleCalls.some(function (entry) {
      return entry.level === 'info'
        && entry.args.some(function (value) {
          return typeof value === 'string' && value.indexOf('variant B') !== -1;
        });
    }),
    true,
    'The landing page should log the resolved headline variant to the console.',
  );

  console.log('headline-ab-fallback.test.js passed');
})();
