# Clean Design UK website — clean rebuild

## Folder structure
- `index.html` — homepage
- `html/` — descriptively named HTML pages and blog posts; no nested `index.html` files
- `css/site.css` — single design system
- `js/` — navigation, forms, cookie preferences and sliders
- `components/` — navbar, footer and cookie banner, edited once for all pages
- `images/` — logos and full portfolio photography
- `sitemap.xml`, `robots.txt` — search crawling
- `_redirects`, `.htaccess` — redirects from former friendly URLs to the new page filenames

## Deployment
Deploy at the domain root through an HTTP server (not by double-clicking an HTML file). The shared components are fetched over HTTP. On Netlify `_redirects` takes effect; on Apache enable mod_rewrite for `.htaccess`.

All new canonical URLs use `https://cleandesignuk.com/html/descriptive-page-name.html` (except the homepage). Old page addresses redirect when your hosting recognises the included rules. Add matching redirects at your host if using another provider. Move the old `.uk` website with permanent one-to-one redirects at your hosting provider.

## Important
Form spam checks in `js/forms.js` are browser-side; for reliable blocking add server-side verification. Third-party delivery via Web3Forms must be tested after deployment. Google Analytics loads only after consent. Review policies and business details before launch.
