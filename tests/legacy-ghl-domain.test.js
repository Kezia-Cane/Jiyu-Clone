const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const filesToAudit = [
  'about-live.html',
  'about-rendered.html',
  'faq-live.html',
  'privacy-live.html',
  'refund-live.html',
  'shipping-live.html',
  'terms-live.html',
  'ghl.html',
  'ghl-ready.html',
  'ghl.js'
];

filesToAudit.forEach((fileName) => {
  const content = fs.readFileSync(path.join(projectRoot, fileName), 'utf8');

  assert.equal(
    content.includes('my.felinebloom.com'),
    false,
    fileName + ' should not contain the old GHL domain.'
  );
});

console.log('legacy-ghl-domain.test.js passed');
