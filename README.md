
# 世田谷グレースチャーチ Website

This site is built with Astro and React. Astro prerenders each public route to static HTML for better SEO, while the existing React components preserve the current design and interactive sermon filters.

## Running the Code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the Astro development server.

Run `npm run build` to fetch sermon, event, and staff data and build the static site into `dist/`.

Set `SITE_URL` in Netlify to the public origin so canonical URLs and the generated sitemap use the right domain. Before launch, use `https://steady-kitten-051261.netlify.app`. When the real domain points to Netlify, change `SITE_URL` to the real domain.

Set `PUBLIC_INDEX_SITE=false` before launch so every page emits `noindex,nofollow`. At launch, change it to `true` and rebuild.

## Google Sheet Content

The sermons archive, events page, and staff page can optionally be refreshed from one Google Apps Script JSON endpoint at build time. The recommended spreadsheet has separate tabs named `Sermons`, `Events`, and `Staff`.

1. Copy `.env.example` to `.env`
2. Set `SERMONS_JSON_URL` to your deployed Apps Script `exec` URL
3. Set `EVENTS_JSON_URL` to the same deployed Apps Script `exec` URL
4. Set `STAFF_JSON_URL` to the same deployed Apps Script `exec` URL
5. Run `npm run sermons:fetch` to pull the latest sermon archive into `src/data/generated/sermons.json`
6. Run `npm run events:fetch` to pull the latest events into `src/data/generated/events.json`
7. Run `npm run staff:fetch` to pull the latest staff profiles into `src/data/generated/staff.json`
8. Run `npm run build` to build the Astro site with the latest fetched content

If `SERMONS_JSON_URL`, `EVENTS_JSON_URL`, or `STAFF_JSON_URL` is not set, that fetch step is skipped and the existing generated JSON stays in place.

The shared endpoint should return:

```json
{
  "sermons": [],
  "events": [],
  "staff": []
}
```

For local build verification without hitting the Google Apps Script endpoints from `.env`, run:

```sh
SERMONS_JSON_URL= EVENTS_JSON_URL= STAFF_JSON_URL= npm run build
```

Event sheet columns:

- `status`: publish rows with `published`
- `eventType`: `event` for dated events or `ongoing` for recurring ministries
- `slug`: URL slug used for `/events/[slug]`
- `date`: `YYYY-MM-DD`
- `dateLabel`: optional display label, generated from `date` when blank
- `title`
- `summary`: short text for the home page cards
- `description`: longer text for the events page
- `imageKey`: `grace-school`, `kids-gospel`, `camp`, or `easter`
- `imageUrl`: optional public image URL, used before `imageKey`
- `featured`: `true` for home page cards
- `notes`: optional internal note text

Staff sheet columns:

- `status`: publish rows with `published`
- `name`
- `role`
- `bio`
- `imageUrl`
- `sortOrder`
- `email`
- `notes`

## Google Sheets Manual Publish

The file `docs/google-apps-script-content-example.gs` includes a starter Google Apps Script that:

- serves the `Sermons`, `Events`, and optional `Staff` tabs as JSON for the build step
- adds a `Website > Publish` custom menu to the spreadsheet
- triggers a Netlify build hook manually
- writes basic publish status into a `Publish Log` tab

To use it:

1. Open the website content spreadsheet in Google Sheets
2. Open `Extensions > Apps Script`
3. Replace the default code with the contents of `docs/google-apps-script-content-example.gs`
4. Set `NETLIFY_BUILD_HOOK_URL` in that script once a Netlify build hook exists
5. Deploy the script as a web app so the `doGet()` JSON endpoint remains available
6. Reload the spreadsheet and use `Website > Publish`

This is intentionally a manual publish workflow so routine edits do not trigger unnecessary Netlify builds.
  
