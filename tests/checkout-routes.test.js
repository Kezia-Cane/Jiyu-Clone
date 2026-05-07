const assert = require('node:assert/strict');

const {
  CHECKOUT_URLS,
  resolveCheckoutUrl
} = require('../checkout-routes.js');

const cases = [
  ['oneTime', 'buy1', 'https://glow.soulalchemy528.com/tonerpadsbuy1'],
  ['oneTime', 'buy1Get1', 'https://glow.soulalchemy528.com/tonerpadsbuy1getfree'],
  ['oneTime', 'buy2Get2', 'https://glow.soulalchemy528.com/tonerpadsbuy2get2free'],
  ['subscription', 'buy1', 'https://glow.soulalchemy528.com/tonerpadsbuy1save30monthlydelivery'],
  ['subscription', 'buy1Get1', 'https://glow.soulalchemy528.com/tonerpadsbuy1get1freesave30monthlydelivery'],
  ['subscription', 'buy2Get2', 'https://glow.soulalchemy528.com/tonerpadsbuy2get2freesave30monthlydelivery'],
  ['one_time', 'buy1get1free', 'https://glow.soulalchemy528.com/tonerpadsbuy1getfree'],
  ['subscription', 'buy2get2free', 'https://glow.soulalchemy528.com/tonerpadsbuy2get2freesave30monthlydelivery']
];

assert.equal(typeof CHECKOUT_URLS, 'object');
assert.equal(typeof resolveCheckoutUrl, 'function');

cases.forEach(function ([purchaseType, bundleKey, expectedUrl]) {
  assert.equal(
    resolveCheckoutUrl(purchaseType, bundleKey),
    expectedUrl,
    'Expected ' + purchaseType + ' / ' + bundleKey + ' to resolve to the correct checkout URL.'
  );
});

assert.equal(
  resolveCheckoutUrl('unknown', 'buy1get1free'),
  CHECKOUT_URLS.oneTime.buy1Get1,
  'Unknown purchase types should fall back to one-time routes.'
);

assert.equal(
  resolveCheckoutUrl('subscription', 'unknown'),
  CHECKOUT_URLS.subscription.buy1,
  'Unknown bundle keys should fall back to the Buy 1 route for the current purchase type.'
);

console.log('checkout-routes.test.js passed');
