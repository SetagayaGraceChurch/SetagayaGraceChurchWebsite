
# 世田谷グレースチャーチ Website

This site is built with Astro and React. Astro prerenders each public route to static HTML for better SEO, while the existing React components preserve the current design and interactive sermon filters.

## Running the Code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the Astro development server.

Run `npm run build` to fetch sermon data and build the static site into `dist/`.

Set `SITE_URL` in Netlify to the public origin so canonical URLs and the generated sitemap use the right domain. Before launch, use `https://steady-kitten-051261.netlify.app`. When the real domain points to Netlify, change `SITE_URL` to the real domain.

Set `PUBLIC_INDEX_SITE=false` before launch so every page emits `noindex,nofollow`. At launch, change it to `true` and rebuild.

## Google Sheet Sermon Test

The sermons archive can optionally be refreshed from a Google Apps Script JSON endpoint at build time.

1. Copy `.env.example` to `.env`
  2. Set `SERMONS_JSON_URL` to your deployed Apps Script `exec` URL
  3. Run `npm run sermons:fetch` to pull the latest sermon archive into `src/data/generated/sermons.json`
4. Run `npm run build` to build the Astro site with the latest fetched sermon data

If `SERMONS_JSON_URL` is not set, the fetch step is skipped and the existing generated sermon JSON stays in place.

For local build verification without hitting the Google Apps Script endpoint from `.env`, run:

```sh
SERMONS_JSON_URL= npm run build
```

## Google Sheets Manual Publish

The file `docs/google-apps-script-sermons-example.gs` includes a starter Google Apps Script that:

- serves the `Sermons` tab as JSON for the build step
- adds a `Website > Publish` custom menu to the spreadsheet
- triggers a Netlify build hook manually
- writes basic publish status into a `Publish Log` tab

To use it:

1. Open the sermon spreadsheet in Google Sheets
2. Open `Extensions > Apps Script`
3. Replace the default code with the contents of `docs/google-apps-script-sermons-example.gs`
4. Set `NETLIFY_BUILD_HOOK_URL` in that script once a Netlify build hook exists
5. Deploy the script as a web app so the `doGet()` JSON endpoint remains available
6. Reload the spreadsheet and use `Website > Publish`

This is intentionally a manual publish workflow so routine edits do not trigger unnecessary Netlify builds.
  
