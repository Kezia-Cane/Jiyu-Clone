const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const publishedPages = [
  'index.html',
  'about.html',
  'faq.html',
  'privacy-policy.html',
  'terms-of-service.html',
  'shipping-policy.html',
  'refund-return-policy.html',
  'checkout.html',
  'thankyou.html'
];

const pages = Object.fromEntries(
  publishedPages.map((fileName) => [
    fileName,
    fs.readFileSync(path.join(projectRoot, fileName), 'utf8')
  ])
);

assert.ok(
  pages['index.html'].includes('href="/about"'),
  'Desktop or mobile navigation on the homepage should link to /about.'
);
assert.ok(
  pages['index.html'].includes('href="/faq"'),
  'Desktop or mobile navigation on the homepage should link to /faq.'
);
assert.ok(
  pages['index.html'].includes('href="/contact"'),
  'Desktop or mobile navigation on the homepage should link to /contact.'
);
assert.ok(
  pages['index.html'].includes('href="/shipping-policy"'),
  'Homepage help links should use the clean /shipping-policy route.'
);
assert.ok(
  pages['index.html'].includes('href="/refund-return-policy"'),
  'Homepage help links should use the clean /refund-return-policy route.'
);
assert.ok(
  pages['index.html'].includes('href="/privacy-policy"'),
  'Homepage help links should use the clean /privacy-policy route.'
);
assert.ok(
  pages['index.html'].includes('href="/terms-of-service"'),
  'Homepage help links should use the clean /terms-of-service route.'
);
assert.ok(
  pages['index.html'].includes("fbq('init', '1345549829342750');"),
  'Homepage should include the requested Meta Pixel init ID.'
);
assert.ok(
  pages['index.html'].includes('https://connect.facebook.net/en_US/fbevents.js'),
  'Homepage should load the Meta Pixel script.'
);
assert.ok(
  pages['index.html'].includes('facebook.com/tr?id=1345549829342750&ev=PageView&noscript=1'),
  'Homepage should include the Meta Pixel noscript fallback.'
);
assert.ok(
  pages['about.html'].includes('href="/faq"'),
  'About page links should point to the clean /faq route.'
);
assert.ok(
  pages['terms-of-service.html'].includes('href="/refund-return-policy"'),
  'Terms page should reference the clean refund policy route inline.'
);
assert.ok(
  pages['thankyou.html'].includes('href="/contact"'),
  'Thank you page should point to the clean /contact route.'
);

publishedPages.forEach((fileName) => {
  const content = pages[fileName];

  assert.equal(
    content.includes('my.felinebloom.com'),
    false,
    fileName + ' should not contain old FelineBloom domain links.'
  );
});

const internalHtmlPatterns = [
  'href="index.html',
  'href="about.html',
  'href="faq.html',
  'href="privacy-policy.html',
  'href="terms-of-service.html',
  'href="shipping-policy.html',
  'href="refund-return-policy.html',
  'href="contact.html'
];

publishedPages.forEach((fileName) => {
  const content = pages[fileName];

  internalHtmlPatterns.forEach((pattern) => {
    assert.equal(
      content.includes(pattern),
      false,
      fileName + ' should not contain stale internal .html links (' + pattern + ').'
    );
  });
});

const scriptContent = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');

assert.ok(
  scriptContent.includes('JiyuCheckoutRoutes'),
  'script.js should consume the shared checkout routes API.'
);
assert.equal(
  scriptContent.includes('tonerpadsbuy'),
  false,
  'script.js should not hardcode checkout URLs now that checkout-routes.js is the single source of truth.'
);

console.log('published-links.test.js passed');
