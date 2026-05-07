# Website Build Strategy: Vercel Frontend + GoHighLevel Checkout System

## 1. System Overview

The Jiyu project is a reusable static website system where the frontend and backend responsibilities are intentionally separated.

- Vercel hosts the frontend website.
- GoHighLevel handles checkout, Stripe payments, forms, upsells, funnels, CRM, and email automation.
- The frontend controls landing pages, product pages, content pages, copy, images, videos, layout, navigation, and conversion sections.
- The frontend does not process payments.
- CTAs on the frontend route the customer into the correct GoHighLevel checkout or funnel URL.

User flow:

- Visitor lands on the Vercel-hosted website.
- Visitor reviews the product page, offer, social proof, FAQ, and supporting content.
- Visitor selects product quantity and purchase type.
- CTA sends the visitor to the matching GoHighLevel checkout URL.
- GoHighLevel completes checkout, payment, upsells, automations, and CRM follow-up.

## 2. Domain Structure

Recommended structure:

- `www.mybrand.com` -> Vercel frontend
- `checkout.mybrand.com` -> GoHighLevel checkout/funnels

This keeps the public website and the revenue backend separate while still feeling like one brand experience.

Alternative option:

- Main website pages and checkout pages can both live under GoHighLevel URLs.
- This is easier operationally, but gives less frontend control and weaker backup flexibility.

Recommendation:

- Use Vercel for the main website.
- Use GoHighLevel for checkout and post-click revenue flows.
- Keep checkout links explicit in the frontend and point them to the correct GoHighLevel pages.

## 3. Jiyu Project as Base Template

The Jiyu project is the master template.

Every new site must:

- Duplicate this project.
- Reuse the same flat static-site structure.
- Reuse the same layout system.
- Reuse the same reusable components.
- Reuse the same JavaScript behavior patterns.
- Replace only brand, offer, product, copy, imagery, links, and checkout destinations.

Do not rebuild future websites from scratch. The fastest and safest path is to clone the Jiyu structure and rebrand it.

## 4. Actual File Structure (IMPORTANT)

Real root files found in the Jiyu project:

- `index.html`
- `about.html`
- `faq.html`
- `shipping-policy.html`
- `refund-return-policy.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `checkout.html`
- `thankyou.html`
- `styles.css`
- `script.js`
- `checkout-routes.js`
- `README.md`

Real folders found in the project:

- `resources/`
- `resources/used/`
- `resources/used/icons/`
- `resources/used/ingredients/`
- `resources/used/products/`
- `resources/used/testimonials/`
- `resources/review/`
- `resources/review/reviews resources/`
- `resources/duplicates/`
- `resources/duplicates/footer icons/`
- `resources/unused/`
- `tests/`

Real test file found:

- `tests/checkout-routes.test.js`

Core frontend template files for future Vercel builds:

- `index.html`
- `about.html`
- `faq.html`
- `shipping-policy.html`
- `refund-return-policy.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `thankyou.html`
- `styles.css`
- `script.js`
- `checkout-routes.js`
- `resources/used/`

## 5. Reusable Components

The real Jiyu frontend uses these reusable components and naming patterns:

- Announcement bar: `.announcement-bar`, `.announcement-bar__inner`, `.announcement-text`, `.announcement-badge`, `.announcement-link`
- Header: `.site-header`, `.site-header__inner`, `.site-logo`, `.site-nav`, `.site-header__actions`
- Mobile navigation: `.header-menu`, `#mobile-nav`, `.mobile-nav`, `.mobile-nav__panel`, `.mobile-nav__links`, `[data-mobile-nav-close]`
- Product page shell: `.product-page`, `#product-page`, `.product-page__inner`
- Product gallery: `.product-gallery`, `#product-gallery`, `.gallery-desktop-grid`, `.gallery-mobile-shell`, `.gallery-mobile-track`, `.gallery-slide`, `.gallery-thumb`
- Product information: `.product-info`, `#product-info`, `.product-header`, `.product-title`, `.product-description`
- Benefit icons: `.benefit-icons`, `.benefit-icon-item`, `.benefit-icon-label`
- Pricing/product selection cards: `.jar-options-section`, `.jar-options`, `.jar-option`, `.jar-badge`, `.price-current`, `.price-compare`, `.price-daily`
- Subscription toggle: `.auto-refill`, `#auto-refill-toggle`, `#auto-refill-title`, `.auto-refill__sub`
- CTA routing: `#add-to-cart`, `[data-checkout-cta]`, `data-checkout-url`, `data-purchase-type`, `data-bundle`
- Product accordions: `.info-accordions`, `[data-accordion]`, `.accordion-header`, `.accordion-body`
- Video thumbnails: `.video-thumbs-row`, `.video-thumb`, `.play-icon`
- Benefit strip: `.benefit-strip`, `#benefit-strip`, `.benefit-strip__track`, `.benefit-strip__item`
- Real results carousel: `.real-results`, `#real-results`, `.results-carousel`, `.result-slide`, `.avatar-btn`, `.carousel-dots`
- Ingredient slider: `.clinical-ingredients`, `#clinical-ingredients`, `.ingredients-slider`, `.ingredients-row`, `.ingredient-card`
- Comparison section: `.how-different`, `#how-different`, `.comparison-table`, `.comparison-row`
- Reviews/social proof: `.reviews-showcase`, `#customer-reviews`, `.reviews-showcase__summary`, `.reviews-showcase__media-grid`
- FAQ section: `.faq-section`, `#faq-section`, `.faq-grid`, `.faq-item`, `[data-faq]`, `.faq-question`, `.faq-answer`
- Social section: `.social-section`, `#social-section`
- Email signup: `.newsletter-section`, `#newsletter-section`, `.newsletter-form`, `.newsletter-input`, `.newsletter-submit`
- Footer: `.site-footer`, `.footer-inner`, `.footer-brand`, `.footer-social-icons`, `.footer-col`, `.footer-bottom`
- Ingredients modal: `#ingredients-modal`, `.modal-overlay`, `.modal-content`, `#modal-close`

These components must be reused in all future builds unless a section is intentionally removed for a specific offer.

## 6. Frontend Strategy (Vercel)

All customer-facing website pages should live in the Vercel project.

Vercel is responsible for:

- Fast static deployment.
- Landing page hosting.
- Product page hosting.
- About, FAQ, policy, and thank-you pages.
- Image, video, copy, and section layout.
- Code-level control over spacing, responsiveness, and conversion flow.
- Easy duplication into backup projects.

The Jiyu frontend is a static HTML/CSS/JS system:

- Shared styling lives in `styles.css`.
- Shared interaction behavior lives in `script.js`.
- Checkout URL mapping lives in `checkout-routes.js` and is also mirrored in `script.js`.
- Pages load `styles.css?v=20260502-1`.
- `index.html` loads `checkout-routes.js?v=20260502-1` and `script.js?v=20260502-1`.

## 7. Checkout Strategy (GHL)

Checkout is handled in GoHighLevel.

GoHighLevel is responsible for:

- Stripe payment collection.
- Checkout pages.
- Upsells and funnels.
- Forms.
- Email automation.
- CRM records.
- Post-purchase workflows.

The frontend should only route users to checkout. It should not contain Stripe logic, payment processing, cart calculation, order creation, or CRM automation.

In Jiyu, checkout CTAs point to GoHighLevel URLs on `https://my.felinebloom.com/...`.

## 8. Product Routing System

Jiyu has a real product routing system for offer selection.

Product selection is based on `.jar-option` buttons in `index.html`:

- `data-jar="1"` with `data-option="buy1"` and `data-bundle="buy1"`
- `data-jar="2"` with `data-option="buy1Get1"` and `data-bundle="buy1Get1"`
- `data-jar="3"` with `data-option="buy2Get2"` and `data-bundle="buy2Get2"`

Purchase type is controlled by:

- `#auto-refill-toggle`
- Checked means subscription.
- Unchecked means one-time purchase.

Real route keys in the code:

- `oneTime.buy1`
- `oneTime.buy1Get1`
- `oneTime.buy2Get2`
- `subscription.buy1`
- `subscription.buy1Get1`
- `subscription.buy2Get2`

Real GoHighLevel checkout URLs currently mapped:

- One-time Buy 1: `https://my.felinebloom.com/tonerpadsbuy1`
- One-time Buy 1 Get 1 Free: `https://my.felinebloom.com/tonerpadsbuy1getfree`
- One-time Buy 2 Get 2 Free: `https://my.felinebloom.com/tonerpadsbuy2get2free`
- Subscription Buy 1: `https://my.felinebloom.com/tonerpadsbuy1save30monthlydelivery`
- Subscription Buy 1 Get 1 Free: `https://my.felinebloom.com/tonerpadsbuy1get1freesave30monthlydelivery`
- Subscription Buy 2 Get 2 Free: `https://my.felinebloom.com/tonerpadsbuy2get2freesave30monthlydelivery`

The logic:

- `getPurchaseType()` checks the auto-refill toggle.
- `getSelectedBundleKey()` reads the selected `.jar-option`.
- `getCheckoutUrl()` returns the matching GoHighLevel URL.
- `syncCheckoutCtas()` updates all `[data-checkout-cta]` elements.
- Clicking `#add-to-cart` prevents default behavior and sends the user to the current checkout URL with `window.location.href`.

This logic must be reused for future product pages. For a new brand, replace the route URLs and product labels, but keep the mapping pattern.

## 9. Backup System (VERY IMPORTANT)

Use multiple Vercel projects for the same frontend system.

Recommended setup:

- Project A -> Live
- Project B -> Backup
- Project C -> Backup

Each project should be a duplicate of the same Jiyu-based frontend structure.

Purpose:

- If the live project breaks, gets flagged, or needs emergency replacement, switch the domain to a backup project.
- Keep the GoHighLevel checkout/funnel backend untouched.
- Avoid changing ad URLs, customer-facing URLs, or checkout setup.

## 10. Domain Switching Logic

Before:

- `www.mybrand.com` -> Project A

After:

- `www.mybrand.com` -> Project B

Same URL. No redirects. Checkout untouched.

The customer still sees:

- `www.mybrand.com`

Only the Vercel project behind that domain changes.

This is why the frontend must be duplicated cleanly across backup Vercel projects. The URL stays stable while the house behind it changes.

## 11. Media Handling

Jiyu uses both remote hosted media URLs and local organized resource folders.

Remote media currently appears from:

- `https://www.jiyuskin.com/cdn/shop/files/...`
- `https://cdn.shopify.com/...`
- `https://assets.cdn.filesafe.space/...`

Local media is organized under `resources/`:

- `resources/used/icons/` for icons and benefit symbols.
- `resources/used/ingredients/` for ingredient imagery.
- `resources/used/products/` for product photos, before/after images, and product renders.
- `resources/used/testimonials/` for review, customer, and social proof assets.
- `resources/review/` and `resources/review/reviews resources/` for review-specific source assets.
- `resources/unused/` for assets not currently used.
- `resources/duplicates/` for duplicate assets found during cleanup.

Media rules for future builds:

- Keep product images in `resources/used/products/`.
- Keep ingredient images in `resources/used/ingredients/`.
- Keep icons in `resources/used/icons/`.
- Keep testimonial and review media in `resources/used/testimonials/`.
- Do not mix active production assets with unused or duplicate assets.
- Preserve `object-fit` behavior from `styles.css`: product renders often use `contain`; lifestyle, testimonial, video, and section imagery often use `cover`.
- If using remote GoHighLevel/FileSafe/CDN assets, keep URLs consistent and documented.

## 12. Workflow for New Website

1. Duplicate the Jiyu project.
2. Rename the project folder and Vercel project.
3. Replace branding in header, footer, meta titles, descriptions, and page copy.
4. Replace assets in `resources/used/` and update image/video references.
5. Update links in header, mobile nav, footer, policy pages, social links, and section anchors.
6. Connect checkout by replacing GoHighLevel URLs in `checkout-routes.js` and matching checkout mapping inside `script.js`.
7. Deploy the frontend to Vercel.
8. Connect `www.mybrand.com` to the live Vercel project.
9. Duplicate the final Vercel project into one or more backup projects.
10. Duplicate GoHighLevel funnels, checkout pages, forms, email automations, and CRM workflows for the new brand.

## 13. Design Reuse Rule

Always reuse:

- Layout structure.
- Section order.
- Product page split between gallery and product information.
- Announcement bar.
- Header and mobile navigation.
- Bundle/pricing card system.
- Auto-refill toggle behavior.
- Results/testimonial/social proof sections.
- FAQ and accordions.
- Newsletter section.
- Footer structure.
- Responsive breakpoints and spacing.

Only change:

- Colors.
- Branding.
- Logo.
- Product.
- Offer names.
- Pricing.
- Copy.
- Images and videos.
- Checkout URLs.
- Policy text.

## 14. Responsive System

Jiyu uses responsive CSS heavily in `styles.css`.

Observed responsive patterns:

- Primary breakpoint around `max-width: 1024px`.
- Additional mobile refinements around `max-width: 480px`, `max-width: 430px`, `max-width: 420px`, and `max-width: 360px`.
- Desktop product gallery uses `.gallery-desktop-grid`.
- Mobile/tablet gallery uses `.gallery-mobile-shell`, `.gallery-mobile-track`, `.gallery-slide`, thumbnails, arrows, and a counter.
- Horizontal scrolling is used intentionally for mobile galleries, video rows, and ingredient rows.
- Small-width fixes include `overflow-x: hidden` rules to avoid accidental page-level horizontal scroll.
- Images use `object-fit: cover` for lifestyle/review/video-style crops and `object-fit: contain` for product renders.
- `script.js` recalculates gallery and carousel state on resize.
- Mobile nav closes on link click, Escape key, backdrop, and viewport resize beyond mobile width.

Future builds must preserve:

- No horizontal page scroll.
- Mobile-first gallery behavior.
- Tablet handling around 1024px.
- Desktop scaling for the full product layout.
- Stable image aspect behavior.
- Text that fits inside cards, buttons, headers, and mobile layouts.

## 15. Link Management

Jiyu link patterns:

- Header logo links to `index.html`.
- Product/shop links usually point to `#product-info` or `index.html#product-info`.
- Glow Club links point to `#newsletter-section` or `index.html#newsletter-section`.
- Main-page section anchors include `#product-gallery`, `#product-info`, `#real-results`, `#clinical-ingredients`, `#how-different`, `#customer-reviews`, `#faq-section`, `#social-section`, and `#newsletter-section`.
- Header and footer currently include GoHighLevel links for About, FAQ, Contact, and policies.
- Footer Help links currently route to GoHighLevel policy/contact URLs.
- CTA checkout links are managed by `[data-checkout-cta]` and JavaScript checkout mapping.

For future builds:

- Update header desktop links.
- Update mobile nav links.
- Update footer links.
- Update policy links.
- Update social links/icons.
- Update all GoHighLevel checkout URLs.
- Keep section anchor IDs stable if reusing scripts.
- If changing an ID, update every link and script reference that depends on it.

## 16. System Diagram

```text
Meta Ads
↓
www.mybrand.com (Vercel)
↓
CTA
↓
checkout.mybrand.com (GHL)
↓
Purchase
```

## 17. Core Principle

"We don't change the URL - we only change the frontend behind it."

Analogy:

- Domain = Address
- Vercel = House
- GHL = Checkout

The address stays the same. The Vercel house can be swapped from Project A to Project B. The GoHighLevel checkout stays connected and continues handling purchases.

## 18. Final Rule

Never build from scratch again.

Always:

- Duplicate Jiyu.
- Rebrand.
- Replace assets.
- Update links.
- Connect checkout.
- Deploy to Vercel.
- Create backup Vercel projects.
- Duplicate GoHighLevel funnels.
- Keep the same system blueprint.
