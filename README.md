# glint. — Interactive UI Demo

A frontend-only prototype of **Glint**, a personal entertainment portal.

**Live preview:** https://scraxemas.github.io/glint-ui-demo/

## Explore the prototype

- **Home** — featured content, recommendations and activity
- **Watch** — movie and series catalog, title previews and simulated playback
- **Live** — six simulated TV channels, electronic program guide and DVR controls
- **Comics** — catalog and interactive reader preview
- **Arcade** — browser game hub, including a playable mini-game
- **Projects** — showcase for personal games and GitHub projects
- **Servers** — Minecraft and Valheim server listings, modpacks and join details
- **VIP** — $0.99/month membership mockup (no payment processing)
- **Account / Admin** — profile and management interfaces

This is an **interactive visual demo only**. Plex, ErsatzTV, Komga, GitHub, Stripe, and Minecraft/Valheim services are **not connected**. All content, stream controls, server statuses, and billing interactions are simulated. No real copyrighted media or payment transactions are hosted here.

## Deployment

This repository uses **GitHub Pages** with `main` as the source and `/(root)` as the published directory. The self-contained `index.html` includes its CSS and JavaScript so the site requires **no build step or dependencies**.

To view locally, download `index.html` and open it in a browser, or run:

```bash
python -m http.server 4173
```

## Future development

See [CODEX_MASTER_PROMPT.md](CODEX_MASTER_PROMPT.md) for instructions to rebuild this proof of concept as a maintainable Next.js / TypeScript application. The existing HTML prototype should remain the reference for the UI while backend integration is planned.
