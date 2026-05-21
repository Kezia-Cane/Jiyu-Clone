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

async function runLandingScriptWithSupabaseFetch(storage, supabaseResponse) {
  let domContentLoadedHandler = null;
  const headline = createElement('Renewal & Rejuvenation Toner Pads');

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
      info() {},
      warn() {},
      log() {},
      error() {},
    },
    document,
    fetch(url) {
      if (String(url).indexOf('supabase.co/rest/v1/ab_tests') !== -1) {
        return Promise.resolve({
          ok: true,
          json() {
            return Promise.resolve(supabaseResponse);
          },
        });
      }

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
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
  }

  return {
    headline: headline.textContent,
    storedPayload: storage.getItem('ab_variant_payload:jiyu_headline_v1'),
    state: context.window.JiyuHeadlineAbState,
  };
}

(async () => {
  const result = await runLandingScriptWithSupabaseFetch(
    createStorage({
      'ab_variant:jiyu_headline_v1': 'B',
    }),
    [
      {
        id: 'fa7ff172-b476-4fed-82e7-7ed314d57841',
        test_key: 'jiyu_headline_v1',
        status: 'active',
        ab_variants: [
          {
            variant_key: 'A',
            headline: 'Renewal & Rejuvenation Toner Pads',
            subheadline: 'A breakthrough daily toner, packed with 8 Korean actives like Niacinamide, Snail Mucin & Peptides.',
            is_control: true,
          },
          {
            variant_key: 'B',
            headline: 'Fade Spots, Smooth Texture & Boost Elasticity in 4-8 Weeks',
            subheadline: 'JiYu toner pads visibly fade spots and boost elasticity.',
            is_control: false,
          },
        ],
      },
    ],
  );

  assert.equal(
    result.headline,
    'Fade Spots, Smooth Texture & Boost Elasticity in 4-8 Weeks',
    'The landing page should prefer the Supabase headline for the assigned variant when the remote test is available.',
  );

  assert.equal(
    result.state && result.state.source,
    'supabase',
    'The landing page should expose that the resolved headline came from Supabase.',
  );

  assert.equal(
    typeof result.storedPayload,
    'string',
    'The Supabase-backed assignment should still be persisted for stable reloads.',
  );

  const refreshedResult = await runLandingScriptWithSupabaseFetch(
    createStorage({
      'ab_variant:jiyu_headline_v1': 'B',
      'ab_variant_payload:jiyu_headline_v1': JSON.stringify({
        variant_key: 'B',
        headline: 'Old Local Payload',
        subheadline: '',
        is_control: false,
      }),
    }),
    [
      {
        id: 'fa7ff172-b476-4fed-82e7-7ed314d57841',
        test_key: 'jiyu_headline_v1',
        status: 'active',
        ab_variants: [
          {
            variant_key: 'A',
            headline: 'Renewal & Rejuvenation Toner Pads',
            subheadline: 'A breakthrough daily toner, packed with 8 Korean actives like Niacinamide, Snail Mucin & Peptides.',
            is_control: true,
          },
          {
            variant_key: 'B',
            headline: 'Fresh Supabase Headline',
            subheadline: 'Fresh Supabase Subheadline',
            is_control: false,
          },
        ],
      },
    ],
  );

  assert.equal(
    refreshedResult.headline,
    'Fresh Supabase Headline',
    'The landing page should refresh a sticky variant with the latest Supabase headline instead of reusing stale stored payload text.',
  );

  console.log('headline-ab-supabase.test.js passed');
})();
