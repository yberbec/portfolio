# Yahya Berbeche — Pixel Portfolio

Angular 20 portfolio with a pixel-art developer workspace and interactive project case studies.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:4200.

## Build

```bash
npm run build
```

## Pages & search

The site uses the Angular router, so each section is its own page: `/work`, `/work/:id` (one page per case study), `/experience`, `/about`, `/skills`, `/education`, `/contact`.

Press `/` or `Ctrl+K` (or click **Search** in the header) to open the search popup. Results are built from the content in `src/app/data/portfolio.data.ts` and open the matching page. Results for a specific item (a job, a degree, a skill group) scroll to it and highlight it briefly.

When deploying to a static host, configure it to serve `index.html` for unknown paths so deep links like `/education` still work on refresh.

## Live data

Settings live in `src/app/config.ts`. Everything is fetched from the visitor's browser (no server, no secrets), so the site works on any free static host.

- **Shipping** (`/shipping`, the corkboard and the monitor in the dev room): a contribution heatmap from github-contributions-api.jogruber.de, plus a feed of public pushes, merged PRs, releases and recent commits from the GitHub REST API. Responses are cached in sessionStorage for 10 minutes, which keeps each visitor well under GitHub's 60 anonymous requests per hour. Tip: in GitHub profile settings, turn on "Include private contributions on my profile" so the heatmap counts your private work (as counts only, no details).
- **Music** (`/music`, the record player): recent tracks and top artists from Last.fm, refreshed every 30 seconds. Set `lastfm.user` and `lastfm.apiKey`. To show Spotify plays, connect Spotify to Last.fm in Last.fm's settings.
- **Live dev room**: the window shows real Montréal weather from Open-Meteo (no key), and day or night follows Montréal time.
- **Theme**: Day / Night / Auto (Auto follows the OS setting), remembered per browser. Press `t` to cycle.

## Project case studies

The Work section includes interactive deep dives for:

- Nespresso Fresh-data integration APIs
- Nespresso Pickup points microservice
- Nespresso Ratings & Reviews migration
- Metro Foundation shared architecture
- Nespresso code quality and production reliability work

Each case study includes project context, documented contributions, a high-level flow, technologies and outcomes. The content is based on the supplied CV; unspecified implementation details and metrics are not claimed.

## Contact details

- Email: via the contact form on the site
- LinkedIn: https://www.linkedin.com/in/yahya-berbeche
- GitHub: https://github.com/yberbec

## Notes

- No CV download is included.
- Contact buttons use the email and profile URLs above.
- The email-copy action uses the Clipboard API, supported in secure contexts such as localhost and HTTPS.
- Run `npm install` after extracting the ZIP. `node_modules` is intentionally excluded so npm installs the correct platform-specific dependencies on your machine.
