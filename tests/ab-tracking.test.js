const assert = require('node:assert/strict');

const {
  buildTrackingPayload,
  createAbTracker,
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
  },
  'Tracking payload should normalize the variant and keep the page context intact.',
);

console.log('ab-tracking.test.js passed');

(async () => {
  const tracker = createAbTracker({
    endpoint: 'https://example.com/api/ab-track',
    fetchImpl() {
      return Promise.resolve({ ok: false, status: 404 });
    },
    location: {
      href: 'https://tryglow.soulalchemy528.com/',
      pathname: '/',
    },
    navigator: {},
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
