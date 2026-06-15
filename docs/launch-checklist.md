# Launch Checklist

Do not point `setagayagrace.jp` at the new site until the indexing block section is complete.

## Accounts And Infrastructure

- [ ] Set up Netlify account under the Setagaya Grace Church email.
- [ ] Set up Netlify form notifications for the `contact` form.
- [ ] Set up Cloudflare R2 account under the Setagaya Grace Church email.
- [ ] Confirm production deploy target and environment variables.
- [ ] Confirm domain/DNS access is available before cutover.

## Before Domain Cutover

- [ ] Confirm production build passes.
- [ ] Review homepage, navigation, mobile layout, and key pages.
- [ ] Verify contact links, giving links, maps, and external forms.
- [ ] Submit a test contact form entry and confirm the notification email is received.
- [ ] Compare against previous site snapshot in `docs/previous-site/`.
- [ ] Remove indexing blocks:
  - [ ] `robots.txt` does not block crawlers.
  - [ ] No `<meta name="robots" content="noindex">`.
  - [ ] Hosting/platform setting is not set to noindex.
- [ ] Confirm canonical URLs use `https://setagayagrace.jp`.
- [ ] Confirm sitemap is generated and reachable.
- [ ] Confirm favicon and social preview image.
- [ ] Confirm analytics and Google Search Console setup, if applicable.
- [ ] Point domain/DNS to the new site.

## After Cutover

- [ ] Visit `https://setagayagrace.jp` in a clean browser.
- [ ] Check key pages return `200`.
- [ ] Check old important URLs redirect correctly.
- [ ] Submit sitemap in Google Search Console.
- [ ] Search for accidental staging URLs or broken assets.
