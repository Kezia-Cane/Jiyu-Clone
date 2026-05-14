const assert = require('node:assert/strict');

const {
  buildTrackingPayload,
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
