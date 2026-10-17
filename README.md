# glint. — Your space to unwind

A premium, frontend-only entertainment lounge. Built with static HTML, CSS, and JavaScript; no framework, package installation, build step, or runtime CDN is required.

**Live site:** https://scraxemas.github.io/glint-ui-demo/

## Explore

| Route | Experience |
| --- | --- |
| `#home` | Cinematic feature, resume shelf, six-channel preview, reading, arcade, studio and community worlds |
| `#watch` | Portrait catalog, landscape shelves, genres, search, sorting, saved list, title/episode details and simulated player |
| `#live` | Six canonical channels, clock-derived guide, channel surfing, compact guide, timeshift simulation and recording bookmarks |
| `#comics` | Manga/comics filters, creator search, reading shelves and a 12-page original illustrated reader |
| `#arcade` | Original-first gaming lounge, filters/search, development previews and playable Neon Snake |
| `#projects` | Studio showcase, technology labels, development notes and verified repository links |
| `#servers` | Minecraft/Valheim demo listings, requirements, rules and simulated access requests |
| `#vip` | Optional $0.99/month membership concept, local supporter styling and billing/cancellation previews |
| `#account` | Local profile, avatar appearance, accessibility/preferences, saved lists and reset controls |
| `#admin` | Clearly marked management previews; all services disconnected |

Hash routes work on direct visits, refresh, and browser back/forward without GitHub Pages rewrites. Mobile has a navigation drawer and six persistent shortcuts.

## Run locally

From the repository directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Keep `assets/`, `css/`, and `js/` beside `index.html` when copying or deploying.

## Demo boundaries

No Plex, playout engine, Komga, authentication, Stripe, or game-server service is connected. Media names and metadata are illustrative; no commercial video, book files, ROMs, or real payment data are included. Server addresses, versions, and counts remain unavailable until configured. Project art is original concept art, not a claim of actual gameplay screenshots or released builds. Only Neon Snake is playable here.

The Watch player simulates pause, seek, captions, mute and fullscreen. Live uses illustrative half-hour schedule slots and a virtual 30-minute buffer. Record saves a bookmark, never video. The reader shows **The Quiet Signal**, an original 12-page illustration study, regardless of the catalog title chosen.

Profile, preferences, watchlist, comic bookmarks, TV bookmarks and VIP preview use `glint_*` localStorage keys. No passwords or tokens are stored. Reset through **Account → Privacy & access → Reset local demo**. Signing out returns to a validated local-profile form; it does not contact an identity provider.

## Keyboard and accessibility

- Ctrl/Cmd+K opens search. Escape dismisses dialogs or exits fullscreen.
- Dialogs and the mobile drawer trap focus and restore it on dismissal. A skip link, visible focus rings, semantic labels and active navigation states are provided.
- Focus the Live picture: Space pauses, arrows seek, Page Up/Down change channel, G opens the compact guide, F opens fullscreen.
- Reader arrows follow the selected LTR/RTL mode. Single-page, vertical-scroll, page-picker and fullscreen modes are available.
- Snake supports arrows/WASD and touch direction buttons.
- OS reduced-motion and local reduced-motion settings are respected.

## Source map

- `js/data.js`: the preserved demonstration catalog.
- `js/core.js`: shared state, icons, storage, search, event dispatch and original Snake game.
- `js/shell.js`: navigation, shared cards, homepage, modal/focus infrastructure and rendering.
- `js/media.js`, `js/live.js`, `js/community.js`: section views and local interactions.
- `css/base.css`: retained primitive/component foundation; `css/design.css`: visual tokens and shared layouts; section CSS files scope specialized experiences.
- `assets/`: bundled font, original SVG studies, optimized cinematic hero and favicon. See [artwork provenance](docs/ARTWORK.md).
- `docs/`: design direction, validation report, screenshots and future integration boundaries.
- [Planned media automation stack](docs/MEDIA_AUTOMATION_PLAN.md): Sonarr, Radarr, Prowlarr, Seerr, Plex, and VPN-isolated qBittorrent (not installed/connected).

Classic scripts load in explicit dependency order and expose a small `featureActions` / `featureHooks` extension surface. No code is dynamically downloaded.

## Validation

Browser checks are plain Playwright CLI functions, not application dependencies. With Playwright CLI already available, start a browser session **from this repository directory**:

```sh
playwright-cli -s=glint open http://127.0.0.1:4173/
playwright-cli -s=glint run-code --filename=tests/layouts.js
playwright-cli -s=glint run-code --filename=tests/interactions.js
playwright-cli -s=glint run-code --filename=tests/accessibility.js
```

The interaction script resets this origin's local `glint_*` demo data. Run it in a disposable browser session. Layout captures are written to `docs/screenshots/` relative to the browser session's starting directory. Scripts return failures explicitly; inspect their returned JSON. They can also target the published URL.

See [validation results](docs/VALIDATION.md). The accessibility script is a focused semantic/solid-color contrast audit, not a complete WCAG certification.

## Publish

GitHub Pages continues to publish **`main` → `/(root)`**. Commit and push the static files; no custom workflow or deployment-setting change is needed. Asset paths are relative and tested under `/glint-ui-demo/`.

[CODEX_MASTER_PROMPT.md](CODEX_MASTER_PROMPT.md) remains a future architecture brief. Its proposed framework/backend migration is not implemented in this static modernization. See [integration boundaries](docs/PHASE1_INTEGRATION_PLAN.md).

## Demo artwork (TMDb)

The 24 sample movie/TV items now include verified TMDb poster and backdrop image URLs. Images are loaded from the TMDb CDN at runtime, and the original Glint SVG art remains a fallback if an image is unavailable. The home and Watch features use an Interstellar backdrop; comics, original games, and projects continue using Glint illustrations.

TMDb attribution appears in the site footer: **“This product uses the TMDB API but is not endorsed or certified by TMDB.”** This demo is non-commercial and does not represent a TMDb endorsement. TMDb states that non-commercial API use with attribution is free; a revenue-generating or commercial Glint launch requires appropriate licensing/permissions and independent review of media artwork rights. See https://developer.themoviedb.org/docs/faq. The current static site contains no API key and does not call TMDb's search API from visitors' browsers.
