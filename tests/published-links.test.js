const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const publishedPages = [
  'index.html',
  'about.html',
  'contact.html',
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

const productVideoButtons = pages['index.html'].match(/<button class="video-thumb"[\s\S]*?<\/button>/g) || [];
const socialVideoPairs = Array.from(
  pages['index.html'].matchAll(/<button class="social-tile[\s\S]*?<video[\s\S]*?poster="([^"]+)"[\s\S]*?<source src="([^"]+)"/g),
  (match) => ({
    poster: match[1],
    src: match[2]
  })
);
const aboutSocialVideoPairs = Array.from(
  pages['about.html'].matchAll(/<button class="social-tile[\s\S]*?<video[\s\S]*?poster="([^"]+)"[\s\S]*?<source src="([^"]+)"/g),
  (match) => ({
    poster: match[1],
    src: match[2]
  })
);
const faqSocialVideoPairs = Array.from(
  pages['faq.html'].matchAll(/<button class="social-tile[\s\S]*?<video[\s\S]*?poster="([^"]+)"[\s\S]*?<source src="([^"]+)"/g),
  (match) => ({
    poster: match[1],
    src: match[2]
  })
);
const vercelConfigPath = path.join(projectRoot, 'vercel.json');
const stylesContent = fs.readFileSync(path.join(projectRoot, 'styles.css'), 'utf8');
assert.ok(
  fs.existsSync(vercelConfigPath),
  'Project should include a vercel.json config for clean Vercel routes.'
);
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

assert.ok(
  Array.isArray(vercelConfig.rewrites),
  'vercel.json should define same-app rewrites for published pages.'
);
[
  ['/about', '/about.html'],
  ['/contact', '/contact.html'],
  ['/faq', '/faq.html'],
  ['/privacy-policy', '/privacy-policy.html'],
  ['/terms-of-service', '/terms-of-service.html'],
  ['/shipping-policy', '/shipping-policy.html'],
  ['/refund-return-policy', '/refund-return-policy.html'],
  ['/checkout', '/checkout.html'],
  ['/thankyou', '/thankyou.html']
].forEach(([source, destination]) => {
  assert.ok(
    vercelConfig.rewrites.some((rewrite) => rewrite.source === source && rewrite.destination === destination),
    'vercel.json should rewrite ' + source + ' to ' + destination + '.'
  );
});

assert.ok(
  pages['index.html'].includes('href="/about"'),
  'Desktop or mobile navigation on the homepage should link to /about.'
);
assert.ok(
  pages['index.html'].includes('href="https://tryglow.soulalchemy528.com/"'),
  'Homepage should point brand home links to the live tryglow domain.'
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
  pages['about.html'].includes('href="https://tryglow.soulalchemy528.com/#product-info"'),
  'About page should send homepage shop links to the live tryglow domain.'
);
assert.ok(
  pages['contact.html'].includes('https://api.leadconnectorhq.com/widget/form/ObqCaTLA2e5XepeDlLWO'),
  'Contact page should embed the GHL contact form iframe.'
);
assert.ok(
  pages['contact.html'].includes('https://link.msgsndr.com/js/form_embed.js'),
  'Contact page should load the GHL form embed script.'
);
assert.ok(
  pages['contact.html'].includes('data-form-id="ObqCaTLA2e5XepeDlLWO"'),
  'Contact page should include the requested GHL form metadata.'
);
assert.ok(
  pages['terms-of-service.html'].includes('href="/refund-return-policy"'),
  'Terms page should reference the clean refund policy route inline.'
);
assert.ok(
  pages['thankyou.html'].includes('href="/contact"'),
  'Thank you page should point to /contact.'
);
assert.equal(
  productVideoButtons.length,
  5,
  'Homepage should expose five customer review video cards near the product section.'
);
assert.ok(
  socialVideoPairs.length >= 5,
  'Homepage social section should expose at least five video poster/source pairs.'
);
productVideoButtons.forEach((buttonMarkup, index) => {
  const expectedPair = socialVideoPairs[index];

  assert.ok(
    buttonMarkup.includes('poster="' + expectedPair.poster + '"'),
    'Product review video ' + (index + 1) + ' should mirror social section poster ' + (index + 1) + '.'
  );
  assert.ok(
    buttonMarkup.includes('src="' + expectedPair.src + '"'),
    'Product review video ' + (index + 1) + ' should mirror social section source ' + (index + 1) + '.'
  );
});
[
  ['about.html', aboutSocialVideoPairs],
  ['faq.html', faqSocialVideoPairs]
].forEach(([fileName, pagePairs]) => {
  assert.equal(
    pagePairs.length,
    socialVideoPairs.length,
    fileName + ' should expose the same number of social videos as the homepage.'
  );

  pagePairs.forEach((pair, index) => {
    assert.equal(
      pair.poster,
      socialVideoPairs[index].poster,
      fileName + ' should mirror homepage social poster ' + (index + 1) + '.'
    );
    assert.equal(
      pair.src,
      socialVideoPairs[index].src,
      fileName + ' should mirror homepage social source ' + (index + 1) + '.'
    );
  });
});
assert.ok(
  pages['index.html'].includes('aria-label="Play customer review video 1"'),
  'Homepage should include the first customer review video card.'
);
assert.ok(
  pages['index.html'].includes('src="https://assets.cdn.filesafe.space/LiPqlEzIjSLGJAzwjVeD/media/69f90bdfca15d8ddc43ba6e0.mp4"'),
  'Homepage should include the requested replacement review video source.'
);
assert.ok(
  pages['index.html'].includes('<figure class="gallery-stats-image gallery-stats-image--full-text">'),
  'Homepage stats image card should opt into the non-cropping full-text treatment.'
);
assert.ok(
  stylesContent.includes('.gallery-stats-image.gallery-stats-image--full-text img'),
  'styles.css should include a specific rule for the full-text stats image.'
);
assert.ok(
  stylesContent.includes('object-fit: contain;'),
  'styles.css should allow the full-text stats image to render without cropping.'
);

publishedPages.forEach((fileName) => {
  const content = pages[fileName];

  assert.equal(
    content.includes('my.felinebloom.com'),
    false,
    fileName + ' should not contain old FelineBloom domain links.'
  );
  assert.equal(
    content.includes('https://glow.soulalchemy528.com/toner-pads'),
    false,
    fileName + ' should not contain the old glow toner-pads homepage URL.'
  );
  assert.equal(
    content.includes('https://glow.soulalchemy528.com/contact-us'),
    false,
    fileName + ' should not contain the old external contact-us link.'
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

  assert.ok(
    content.includes('Silmea LLC 5830 E 2nd Street Suite 7000, Unit #78521 Casper'),
    fileName + ' should include the updated footer address line 1.'
  );
  assert.ok(
    content.includes('WY 82609 USA'),
    fileName + ' should include the updated footer address line 2.'
  );
});

const scriptContent = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');

assert.ok(
  scriptContent.includes('JiyuCheckoutRoutes'),
  'script.js should consume the shared checkout routes API.'
);
assert.ok(
  scriptContent.includes('video.load();'),
  'script.js should reload media before playback for unreliable video tiles.'
);
assert.equal(
  scriptContent.includes('tonerpadsbuy'),
  false,
  'script.js should not hardcode checkout URLs now that checkout-routes.js is the single source of truth.'
);

console.log('published-links.test.js passed');
