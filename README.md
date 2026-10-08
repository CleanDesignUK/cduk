# Clean Design UK — Homepage rebuild

This is the redesigned homepage stage for `https://cleandesignuk.com/`.

## Design direction
The homepage was rebuilt from scratch around the supplied references: oversized editorial typography, strong black/cream sections, image-led portfolio work, tilted image/card compositions, restrained motion, simple navigation and the Clean Design UK red palette. It deliberately avoids generic gradient-heavy SaaS styling and does not use arrow icons in buttons or cards.

## Shared components
- `components/navbar.html`
- `components/footer.html`

The components are loaded by `assets/js/main.js`, so edit each component once rather than updating every page.

> Preview the site through a local or hosted web server. Browser security can block component `fetch()` calls when opening `index.html` directly with `file://`.

## CSS
- `assets/css/styles.css` — global design system, navigation, forms, footer, cookie banner
- `assets/css/home.css` — homepage only
- `assets/css/legal.css` — legal pages

## Forms
There are two Web3Forms forms on the homepage. Replace every instance of:

`YOUR_WEB3FORMS_ACCESS_KEY`

with the live key.

No checkbox or visible CAPTCHA is used. Anti-spam checks include an invisible text honeypot, submission timing, duplicate submission delay, phone validation, blocking +91/+92 phone codes, repeated-number filtering, blocking Clean Design UK email/domain impersonation, and filtering common backlink/SEO/web-service sales pitches.

Successful submissions use SweetAlert and stay on the same page.

## Planned service and content architecture
The navigation already points to the next pages to build:
- `/about/`
- `/website-design/`
- `/ecommerce/`
- `/seo/`
- `/ai-search-optimisation/`
- `/branding/`
- `/digital-marketing/`
- `/sales-funnels-automation/`
- `/gohighlevel-support/`
- `/portfolio/`
- `/blog/`
- `/contact/`
- local landing pages for Anglesey, Gwynedd, Bangor, Caernarfon, Llandudno, Wrexham and North Wales

Do not add these future URLs to the XML sitemap until their pages are actually published.

## Placeholder images
All photography is currently loaded from Pexels as placeholder imagery, including the temporary brand mark/favicon treatment. Replace with final Clean Design UK assets and real project screenshots before launch.
