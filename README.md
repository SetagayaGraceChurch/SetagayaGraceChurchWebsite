
  # 無題

  This is a code bundle for 無題. The original project is available at https://www.figma.com/design/Od7OZC6sUnsYXIStxEra7S/%E7%84%A1%E9%A1%8C.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Google Sheet Sermon Test

  The sermons archive can optionally be refreshed from a Google Apps Script JSON endpoint at build time.

  1. Copy `.env.example` to `.env`
  2. Set `SERMONS_JSON_URL` to your deployed Apps Script `exec` URL
  3. Run `npm run sermons:fetch` to pull the latest sermon archive into `src/data/generated/sermons.json`
  4. Run `npm run build` to build the site with the latest fetched sermon data

  If `SERMONS_JSON_URL` is not set, the fetch step is skipped and the existing generated sermon JSON stays in place.
  
