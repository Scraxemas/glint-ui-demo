# Future integrations — deliberately unconnected

This release is static presentation plus local demo state. These are future boundaries, not implemented services:

| Area | Future responsibility |
| --- | --- |
| Watch / Plex | Protected, account-authorized catalog and playback adapter. Editorial approval, file availability and playback authorization must remain separate. Never expose owner tokens to the browser. |
| Media discovery / Seerr | Owner-approved movie/TV request interface; authenticate users, apply quotas and show Plex availability. Seerr supersedes Overseerr/Jellyseerr. |
| Media management / Sonarr, Radarr, Prowlarr | Series and movie organization, permitted indexer management and request-to-library processing. Keep service admin interfaces private. |
| Download client / qBittorrent, Gluetun, NordVPN | Authorized downloads only. Isolate qBittorrent in a VPN-only network and separately evaluate Prowlarr indexer privacy; verify fail-closed transfers. |
| Glint Live | Clock-driven scheduler plus replaceable playout engine. Schedule advances without viewers; encoding should start only as needed and share channel output. No transcoding is implemented here. |
| Comics / Komga | Authorized metadata, page access, and reading-progress synchronization. Replace original sample pages only with permitted content. |
| Accounts | Real identity provider, server-side access checks and sessions. Current profile and admin pages confer no authorization. |
| VIP / Stripe | Hosted checkout, verified webhooks and a customer portal. Local VIP styling is not proof of payment or media/server entitlement. |
| Projects / GitHub | Curated public repositories, owner-provided build URLs, verified release information. Only this repository's URL is configured. |
| Minecraft / Valheim | Protected read-only status collectors. Public listings must not expose management credentials or private addresses. Real access requests require backend authorization. |

Future programming rules should preserve canonical channel numbers/names, release-order continuity, premiere/encore blocks, franchise movie gates, bumpers and faux commercials. The current half-hour fixture schedule demonstrates the guide interface; it does not implement those scheduling requirements or claim correct real runtimes.

No service credentials, billing forms, player binaries, external games, DRM workarounds, or streaming files are part of this release.

The selected media automation architecture and phased rollout are documented in [MEDIA_AUTOMATION_PLAN.md](MEDIA_AUTOMATION_PLAN.md). These tools are **not yet installed** on the planned home server and have no connection to the public website.
