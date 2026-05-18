const assert = require('node:assert/strict');

const {
  buildVariantStorageKey,
  getStoredVariant,
  setStoredVariant,
} = require('../ab-tracking.js');

function createStorage() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

const storage = createStorage();

assert.equal(
  buildVariantStorageKey('jiyu_headline_v1'),
  'ab_variant:jiyu_headline_v1',
  'Variant storage keys should be namespaced per test.',
);

setStoredVariant(storage, 'jiyu_headline_v1', 'b');

assert.equal(
  storage.getItem('ab_variant:jiyu_headline_v1'),
  'B',
  'The per-test storage key should persist the normalized variant.',
);

assert.equal(
  storage.getItem('ab_variant'),
  'B',
  'The legacy storage key should stay in sync for existing tracker reads.',
);

assert.equal(
  getStoredVariant(storage, 'jiyu_headline_v1'),
  'B',
  'Variant reads should prefer the per-test storage key.',
);

const legacyOnlyStorage = createStorage();
legacyOnlyStorage.setItem('ab_variant', 'a');

assert.equal(
  getStoredVariant(legacyOnlyStorage, 'jiyu_headline_v1'),
  'A',
  'Variant reads should fall back to the legacy key when needed.',
);

console.log('ab-variant-storage.test.js passed');
