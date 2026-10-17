# CODEX MASTER PROMPT — GLINT UI PROTOTYPE → PRODUCTION-READY FRONTEND FOUNDATION

You are the lead frontend engineer, senior UX/UI designer, accessibility engineer, and test engineer for **Glint**, a minimalist entertainment lounge website. Your task is to **implement the most comprehensive and polished UI prototype possible**, building on the supplied reference prototype, while deliberately **NOT** integrating any live backends, billing, commercial media, or game-server credentials yet.

## Important references and starting procedure

1. First inspect the existing repository. Never overwrite existing work without examining it. If the repo is empty, scaffold a new Next.js App Router TypeScript application. If it already contains an app, integrate incrementally and preserve its working features.
2. The reference UI prototype is provided in `Glint_UI_Prototype/` with `index.html`, `styles.css`, `data.js`, `app.js`, `assets/favicon.svg`, and preview screenshots. Treat it as a **visual/interaction specification**, not production code to dump into React.
3. Read the user-approved constraints in this prompt and create a short implementation checklist. Work autonomously through all UI work until the app runs and tests pass; do not stop after only a homepage or a planning document.
4. First generate the complete, working multi-page front end. Use mocked, type-safe adapters with fixture data. Do not require secrets, real servers, payment products, GitHub identities, or a live Plex library to launch the UI.
5. Do not push to production, deploy, purchase domains, install payments, change existing game deployments, or mutate a real Plex/GitHub/server account. Prepare for later integrations, but the implementation scope here is presentation and client-side prototype behavior.

## Product and naming

**Glint** is one elegant entertainment platform that feels like a Netflix-inspired media service and a relaxing digital lounge with a subtle retro-arcade personality. It includes Home, Watch, Live TV, Comics, Arcade, Projects, Game Servers, VIP, Account, and Admin.

The historic term **“Airsats” was a typo for “ErsatzTV.” Do not use Airsats or create an Airsats brand anywhere in the UI, code, or documentation.** The platform is **Glint**. The *live scheduling engine* may later be a custom Glint scheduler with a replaceable video output adapter (possibly ErsatzTV Next), not necessarily ErsatzTV Legacy. For this phase both are unconnected stubs.

Working visual direction: very dark charcoal/blue-black background, soft muted lilac/violet accent, restrained silver/blue and occasional seafoam status color, premium Netflix/Steam feel, subtle glowing or orbital line treatments. Use excellent visual hierarchy, strong card cover compositions, high-quality responsive spacing, pleasant hover/focus/pressed states, and smooth but minimal motion. Prefer a simple text wordmark `glint.` plus a restrained glyph; avoid gaudy neon or generic enterprise dashboard visuals. It should feel like a *real consumer product*.

Use only artwork that we own/have permission for or intentional abstract placeholder covers. Do NOT fetch or embed pirated movie artwork, commercial movies, comic pages, copyrighted logos, or game ROMs. Famous movie/comic/show *titles and text descriptions* in fixture catalogs are demonstrative only and do not imply that playable files exist.

## Technology and engineering constraints

- TypeScript strict mode, React, Next.js App Router, Tailwind CSS (current project-compatible stable versions).
- Build reusable accessible components. You may use shadcn/ui or Radix-style accessible primitives; create a cohesive custom design system rather than mixing many incompatible libraries.
- Use `lucide-react` or an equivalent consistent vector icon set.
- Server/data adapters must be defined behind interfaces (e.g. `MediaCatalogProvider`, `LiveScheduleProvider`, `ComicCatalogProvider`, `GameCatalogProvider`, `GitHubProjectsProvider`, `GameServerStatusProvider`, `MembershipProvider`). Implement a `Mock*Provider` for each. Future real providers must be swappable without rewriting UI components.
- Fixtures should be centrally typed and obviously marked demo; use data inspired by the supplied reference prototype and current channel lineup.
- State management: React hooks and context, Zustand or equivalent if useful. Persist only harmless demo UI settings, bookmark preferences, mock watchlist, local comic page, and simulated profile mode to localStorage. Never persist real tokens/secrets.
- Do not build a real login system during this UI phase. Show login/register/forgot-password/password reset screens as **forms with validation and simulated outcomes**, prominently labeled DEMO. A preconfigured demo member should make the prototype immediately explorable.
- No hardcoded fake real-time visitor metrics, fake 'verified online' game servers, real charges, or implied streaming. Explicitly label all fake states as `Demo`, `Sample schedule`, `Not connected`, or `Preview`.
- Sensible `loading`, `empty`, `error`, and `offline` states in all major views.
- Make UI accessible: semantic navigation, readable contrast, keyboard navigation, ESC dismissal, focus management/traps in dialogs, reduced-motion support, accessible forms, hit areas ≥44px for mobile, `aria` attributes, and alt text for actual images.
- Support Chrome, Firefox, Safari, Android mobile and iPhone layouts; responsive starting around 360px to 1920px. No horizontal overflow at narrow widths.
- Search should be keyboard-friendly with Ctrl/Cmd+K and indexed **fixture** data; support filtered results across media, games, comics, projects, servers.
- Use modular route-based architecture, not a single monolithic React component.
- Do not add unnecessary server/database complexity or create authentication/billing vulnerabilities in the name of 'future-proofing'.

## Global layout and shell

Desktop: 240px fixed/expandable left navigation, wordmark at top, links grouped Discover (Home, Watch, Live TV, Comics, Arcade), Community (Projects, Game Servers), Your Space (Glint VIP, My Account, Control Center), a subtle VIP promotional card, footer version. Header: searchable omnibox, optional notification mock button, current demo user avatar, account dropdown. Main content max width ~1600px with deliberate whitespace.

Mobile: slide-out navigation for all routes; persistent bottom shortcuts Home/Watch/Live/Comics/Arcade + More; sticky compact header; generous touch targets, accessible safe-area behavior. Search is always reachable. Use consistent page headings, chip filters, empty state illustrations, poster cards, progress bars, and content shelves.

Global functionality: demo-mode notice without being obnoxious; meaningful navigation in every button; interactive title detail modals; working mock search, filters, watchlist, reader page navigation, channel switching, on-demand mock controls, account preferences, VIP preview, and toasts. Never present fake functionality as if it were truly connected.

## Every required page and route

### 1. `/` — Home

- Editorial hero such as “Take a moment. Stay a while.” with two CTAs (“Explore Watch” and “Browse Live TV”).
- Personalized greeting based on demo profile, subtle VIP distinction.
- Continue Watching row with per-title progress.
- Live Right Now cards for the six sample channels and a link to the guide.
- Watch curated shelves (Tonight's picks, Trending in Your Library [**sample only**], Anime, Sitcoms, Sci-Fi, Recently Added).
- Continue Reading (comic issue/page progress), Continue Playing (only where mock game state exists), Your Arcade (featured original).
- From the Studio (recent development updates from curated project fixtures).
- Online Worlds (Minecraft and Valheim cards showing **not connected** until real probes exist).
- Subtle VIP upgrade promo, not an aggressive upsell.
- Preserve clean, pleasant Netflix-like presentation and balanced density.

### 2. `/watch` — Glint Watch catalog

- Cinematic featured hero; horizontal collections; filter chips for type and genre; optional sort/select and collection search.
- Sample movies/TV/anime inspired by previous Glint lists; support artwork and posters as custom abstract generated placeholders.
- Title pages `/watch/[slug]` and/or a clear modal with title, year, type, content rating, runtime, synopsis, genre, quality badge, placeholder cast info if absent, favorites, related titles.
- Series detail: seasons and episode cards using specifically labeled sample seasons/episodes; avoid inventing canonical source metadata as facts. Watch progress placeholders.
- Player preview `/watch/[slug]/play` with inert but responsive transport buttons, seek demonstration, subtitle/audio controls represented as UI, fullscreen layout mock. Never stream or fetch an actual video in this phase. A ‘Connect Plex’ stub explains future integration.
- Wishlist/watchlist with persistent local mock state and an empty-state screen.
- Future Plex adapter will be **account-authorized**; never send or embed an owner server token in browser code. Plex manages authorized media streaming separately. The Glint account is not automatically a Plex login.

### 3. `/live` — Glint Live

Six canonical channel identities (must be exact):
- 101 — **Glint Toons** (retro cartoons, Battle Zone, Toonami, Adult Swim)
- 103 — **Glint Cinema** (feature films, double features)
- 105 — **Laugh Track** (family sitcoms, primetime, late night)
- 106 — **Drama Central** (police/crime, prestige drama)
- 107 — **Dark Worlds** (apocalypse, supernatural, horror)
- 108 — **Otherworlds** (fantasy, sci-fi, space)

Implement the richest live TV page in the prototype:
- A premium 16:9 fake channel screen with atmospheric **original abstract station art**, channel number, live indicator, show title, next program, overlay info, fullscreen visual behavior.
- Dynamic *mock* wall-clock program guide: deterministic, clock-derived guide entries so tune-in appears mid-episode and schedule advances even when no player is open. Never call this a real stream or real EPG.
- EPG grid with channel column, 30-minute positions, scrollable horizontal timeline, current program marker, next up; clicking any program/channel tunes demo state.
- Channel surfing buttons and keyboard shortcuts; mini-guide overlay; program detail card.
- TiVo-style concept controls: pause/resume, rewind 15 seconds, fast-forward within simulated buffer, restart program, Go Live, record episode and “My Recordings” list, with clearly labeled virtual recording bookmark state. **No actual video, transcoding or saved DVR file is created.**
- Build typed future provider interfaces for scheduler and playback. Production requirement: **schedule advances 24/7 in real time even without viewers, while encoding is inactive without viewers**, and shared channel output ideally serves multiple viewers. Do **not** implement a live encoder or pretend this is solved in a UI task.
- Programming design: original release order; Monday/Wednesday premieres, Tuesday/Thursday encores; channel-specific blocks; bumpers/faux commercials; movies gated behind franchise milestones; preserve playlist continuity. Place this in a requirements doc and provider interface, not a fake scheduler implementation.
- A potential future architecture is custom Glint scheduler + replaceable playout engine (ErsatzTV Next or tested alternative). Plex and Glint Live may index the **same files** without storing duplicate media.

### 4. `/comics` and `/comics/[slug]/read` — Glint Comics

- Premium cover grid and manga/comics shelves, type filters and reading collections.
- Title detail with publisher/creator (only data if in fixtures), series summary, issue list, reading percentage, Continue Reading.
- Interactive **placeholder** reader with page navigation and 12 stylized ORIGINAL demo pages, page number, next/previous controls, single-page and vertical-scroll mode mock, LTR/RTL toggle, fullscreen preview, keyboard arrows, saved local page progress.
- Future Komga adapter for metadata/page index, access checks and reading progress. No real book files are bundled.

### 5. `/arcade` and `/arcade/[slug]` — Glint Arcade

- Original-first game catalog; a featured Project Pancake display plus Rain of Iron (PC CRPG, development only), persistent creature MMO (prototype), and other placeholders.
- Cover art, genre, inputs, status, screenshots slots, changelogs, developer notes, game launcher UI.
- One *actually playable* local original mini-game (e.g. polished Snake, Pong, or a tiny arcade game), keyboard and touch controls. It should work without a backend.
- Project Pancake should NOT have a fabricated working Play link. It is a separate Phaser/Colyseus project with its own deployment and save architecture. Use a demo details page and an integration placeholder until the verified game URL is provided.
- Retro console/emulator UI can be designed but no ROMs, bioses, emulator binaries, or unauthorized content should be included. Clear 'Not connected' messaging.

### 6. `/projects` and `/projects/[slug]` — Studio showcase

The Projects page is NOT a résumé or an employment history section. Feature development work, game concepts, repositories, release notes and playable builds. Sample cards: Project Pancake, Rain of Iron, creature-catching MMO engine, Glint itself, custom map/tool experiments. Detail pages: status (concept/dev/playable), description, tech stack, gallery, devlog, milestone roadmap, GitHub link when **verified/owner-provided**, download/play when configured. No invented user GitHub URLs or fabricated live releases. Provide a mock studio activity feed and a future GitHub adapter for curated public repositories.

### 7. `/servers` and `/servers/[slug]` — Multiplayer communities

- Minecraft Java modded survival, optional Minecraft vanilla/realm, and Valheim demo listings.
- Status, uptime, player counts, version, modpack, loader, whitelist flag, rules, connection tutorial, planned downloads, screenshots, announcements and patch history.
- All server status readouts must say `Not connected`/`Sample data` until backed by a real status provider. No fabricated IP address or copy button that claims to copy an actual server IP. A disabled “Copy server address” with explanatory tooltip is ideal.
- Allow local demonstration of modpack requirements and 'Request access' modal, but do not send a real request or expose private join passwords, RCON, files, credentials or management endpoints.
- Future adapter roles: read-only Minecraft probe, Valheim probe, Crafty Controller integration; admin control surfaces separate from public status.

### 8. `/vip` — $0.99/month Glint VIP

- Elegant VIP pricing hero exactly **$0.99 per month**; Standard vs VIP comparison; perks for original Glint features, visual themes, VIP badge, behind-the-scenes development posts, original game early access.
- Billing/cancellation/customer portal **mock screens**. Simulated checkout cannot collect actual credit cards or claim success charging money. Use an obvious demo “Preview VIP upgrade” control and a local VIP styling state.
- Design for future Stripe Checkout, webhooks and Stripe Customer Portal, but do not connect it now. No actual paid media entitlements or automatic Minecraft whitelist from subscribing.
- Explicitly avoid selling access to commercial movies, comics, TV or ROMs without corresponding rights.

### 9. `/login`, `/register`, `/account` — account UX

- Account registration is required for the *real* platform; for a UI-only phase provide a preloaded demo member and interactive registration/login mock forms with clear disclaimers.
- Profile settings, avatar mock, membership status, accessibility/reduced motion, notifications, local preferences, Watch history mock, favorites, reading bookmarks, log out, reset prototype.
- No actual passwords should be stored in localStorage or committed to fixtures. Make clear that the demo profile is local-only.

### 10. `/admin` — Control Center UI mock

- Integration cards showing Plex, Glint Live playout, Komga, GitHub, Stripe, Minecraft/Valheim all as **Not connected**.
- Sample user-count/catalog-count/health metrics visibly marked fixtures; content approval/scheduling preview screens, future TV catalog import status; server updates/log concepts; per-provider settings placeholders.
- Admin action buttons must be disabled or show explanatory mock modal. No actual server mutations, deletes, user creation, billing actions, or backup runs.

## Shared patterns, visual polish, and component architecture

Create components along these lines:
`AppShell`, `DesktopSidebar`, `MobileBottomNav`, `GlobalHeader`, `CommandSearch`, `EditorialHero`, `ContentShelf`, `MediaPosterCard`, `MediaDetailDrawer`, `FilterChips`, `Badge`, `ProgressBar`, `MockMediaPlayer`, `LiveChannelSwitcher`, `EPGTimeline`, `TVRemoteControls`, `ComicReader`, `ArcadeGameLauncher`, `ProjectCard`, `ServerStatusCard`, `ModpackGuide`, `VIPPricingCard`, `AccountSettings`, `AdminIntegrationCard`, `EmptyState`, `LoadingSkeleton`, `Toast`.

Cards and shelves should use controlled consistent proportions. Refine typography, gradients, focus rings, shadows, mobile layouts, and poster abstracts beyond the supplied static prototype. Favor a clean minimalistic lounge over noisy neon graphics. Make each section distinct but still recognizably Glint.

Consider lightweight framer-motion / motion library animations only if sensible; honor `prefers-reduced-motion`. Prevent layout shifts and oversized bundles.

## Suggested project structure

```text
src/
  app/
    (site)/page.tsx
    (site)/watch/page.tsx
    (site)/watch/[slug]/page.tsx
    (site)/live/page.tsx
    (site)/comics/page.tsx
    (site)/comics/[slug]/read/page.tsx
    (site)/arcade/page.tsx
    (site)/arcade/[slug]/page.tsx
    (site)/projects/page.tsx
    (site)/projects/[slug]/page.tsx
    (site)/servers/page.tsx
    (site)/servers/[slug]/page.tsx
    (site)/vip/page.tsx
    (site)/account/page.tsx
    (site)/admin/page.tsx
    login/page.tsx
    register/page.tsx
  components/
    layout/
    shared/
    watch/
    live/
    comics/
    arcade/
    projects/
    servers/
    vip/
  lib/
    types/
    providers/
      interfaces.ts
      mock/
    fixtures/
    utils/
  hooks/
  styles/
  tests/
public/
  brand/
  posters/ (abstract placeholders only)
  demo/ (own original mini-game assets only)
```

Adapt it to the repository and current framework idioms rather than slavishly adhering to the exact tree.

## Data integrity and intellectual property rules

- Glint's future TV content master has six reviewed channels and approved movie/show lists, but **catalog approval is not evidence that the file exists** on Plex or that redistribution is permitted. Model distinct states `editoriallyApproved`, `mediaAvailable`, `playbackAuthorized`.
- Do not import the spreadsheet in the first UI phase unless a current provided file is present and it improves the mock catalog. The illustrated catalog may be small, clearly marked fixture data.
- Franchise movie gates and original-release-order chronology belong to future scheduling logic, not merely to artwork on the UI.
- The working name **Glint** is not trademark-cleared yet; do not buy a domain or assert clearance.

## Acceptance and testing

1. Run code quality commands (`lint`, `typecheck`, `build`, tests) and fix errors.
2. Add Playwright E2E tests covering desktop + mobile:
   - Navigate through all sections and refresh routes.
   - Global Ctrl/Cmd+K search and result selection.
   - Watch filters, item details and watchlist persistence.
   - Live channel change, sample EPG, simulated pause/rewind/go-live/recording with truthful demo labeling.
   - Comic reader page navigation and progress persistence.
   - Arcade mini-game keyboard and touch handling.
   - Projects and servers show valid mock detail pages; no fake live IP or GitHub URL.
   - VIP preview state (no network billing), account form validation and local settings.
   - Mobile nav, focus rings, reduced motion, no horizontal overflow.
3. Capture screenshots for homepage, Watch, Live, Comics reader, Arcade, Projects, Servers, VIP, and a mobile homepage. Save them under `docs/screenshots/` or equivalent.
4. Make sure empty/error/loading states render. Prevent console errors and hydration mismatch.
5. Write a `README.md` with setup, commands, route map, mock data disclosure, how to reset state, and the eventual backend adapter interfaces. Add `docs/PHASE1_INTEGRATION_PLAN.md` listing what Plex, video playout, Komga, Stripe, GitHub and server connections will need later.
6. Implement a graceful, interactive experience even if absolutely no environment variables are configured.
7. Finish with a concise report containing the files changed, routes implemented, commands run, tests passed/failed, remaining UI work, and the exact local preview URL/command.

## Success criteria

The result should look like a complete premium consumer streaming/gaming website, not a generic admin dashboard. Every major page exists, is responsive, and can be explored with believable, honestly labeled demo interactions. The architecture is clean enough that Plex, Glint's own scheduling engine and replaceable streaming output, Komga, GitHub, game servers, and VIP payments can be integrated incrementally in later phases **without replacing the design system**.

Proceed to implement rather than only describing a plan. Do not stop after the first page. Resolve normal design details proactively, but do not invent secret credentials, real external addresses, or claim any media/subscription/game server is operational.