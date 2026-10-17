# Glint media automation stack — approved plan

**Status: planned; not installed or connected.** Glint is currently a static GitHub Pages UI demo. The Linux host, storage layout, credentials, remote access, and backend have not been configured.

## Components and responsibilities

| Component | Role | Network/access |
| --- | --- | --- |
| Plex | Authenticated playback and library indexing | Normal home-server network; Plex account access |
| Sonarr | Series/episode monitoring, quality profiles, rename/import and library management | Private Docker network; no public admin port |
| Radarr | Movie monitoring, quality profiles, rename/import and library management | Private Docker network; no public admin port |
| Prowlarr | Authorized indexer configuration, search and application sync to Sonarr/Radarr | Private admin access; review VPN/privacy routing for indexer lookups |
| Seerr (successor to Overseerr and Jellyseerr) | Browse/discover media, request and approve titles, and inspect Plex availability | Authenticated request interface; private or access-controlled HTTPS |
| qBittorrent | Download client for legitimately available/authorized torrent content | **Shares Gluetun VPN network namespace**; no independent public egress |
| Gluetun + NordVPN | Encrypted network tunnel and kill-switch for torrent transfer container | NordVPN OpenVPN service credentials, supplied privately at install time |
| Komga | Comics/manga library | Separate protected service |
| ErsatzTV | Virtual live TV playout | Separate protected service |

Do **not** connect Seerr, Sonarr, Radarr, Prowlarr, qBittorrent or Gluetun directly to the public GitHub Pages prototype. The browser must never receive internal service tokens, API keys, VPN credentials or unrestricted download/control endpoints.

## Intended workflow

1. A trusted user discovers a movie or show in **Seerr**, which checks the existing Plex library.
2. A request is either queued for **owner approval** or accepted under deliberately granted permissions. Default: require owner approval for other users.
3. For approved, authorized content, **Seerr** sends TV requests to **Sonarr** and movie requests to **Radarr**.
4. **Prowlarr** provides permitted indexers and synchronizes eligible indexer settings to Sonarr/Radarr.
5. Sonarr/Radarr select a configured source and submit download jobs to **qBittorrent**.
6. qBittorrent transfers only over a **Gluetun → NordVPN** tunnel, with firewall/kill-switch behavior independently verified.
7. Completed downloads are imported/renamed into the correct TV/movie folders. **Plex** scans the library and updates availability.
8. **Seerr** reflects availability; Glint's future authenticated integration can show request state or link users into Seerr.

Use legally available, licensed, owned, or otherwise authorized content. TMDb/Plex metadata and posters do not imply ownership of media files or rights to acquire/distribute them.

## Storage rules (confirm drives before deployment)

- Put the OS, Docker state, app databases and metadata on the internal SSD, with backups.
- Put bulk movie/TV files on the media drive(s) after health, filesystem and mount verification.
- Configure **one consistent /data mount** shared by qBittorrent, Sonarr and Radarr, with directories such as `/data/torrents/{movies,tv}` and `/data/media/{movies,tv}`.
- Arrange torrent working directories and final libraries on the **same underlying filesystem** where feasible; verify hardlinks/imports before enabling seeding. Different disks/filesystems may require copying instead.
- Keep distinct Docker configuration volumes for Sonarr, Radarr, Prowlarr, Seerr and qBittorrent. Never treat the app container writable layer as a data backup.
- No disk wiping, filesystem conversion or partition changes before inspecting all drive contents, backups and OS plan.

## Security and remote-access requirements

- Publish no *Arr admin interfaces, qBittorrent WebUI, Gluetun control API, database ports or API tokens on the public internet.
- Restrict management to the trusted LAN or a device-authenticated private network (e.g. Tailscale).
- For other household/friend requests, start with Seerr accounts, quotas, and manual approval. Public-facing requests would later need verified HTTPS + identity and additional security review.
- Only qBittorrent's torrent transport is assumed to use Gluetun by default; **Prowlarr's indexer/search traffic needs a separate routing decision and validation** if VPN coverage is desired for that activity too.
- Obtain NordVPN **manual OpenVPN service credentials** securely during installation; never commit them or a populated `.env` file.
- Check public IP, DNS behavior, disconnect fail-closed behavior, app connectivity and WebUI access before allowing transfers.
- Avoid routing Plex, the Glint website/backend, Seerr and private management traffic through the torrent VPN by accident.
- Apply security updates, run supported images with least privilege, and keep off-machine backups of configs.

## Glint UI integration path

**Frontend preview (implemented):** GitHub Pages includes a `#requests` page with sample catalog search, movie/series filters, local-only sample requests, and a conceptual status/ETA progression. No real Seerr request is submitted, no remote request queue exists, and the UI shows no live ETA. The production request system remains a later backend project.

**Phase 0:** Linux Mint and storage/network readiness; no media automation services installed yet.

**Phase 1A:** Deploy Docker Engine/Compose and validate disk mounts, local networking and backups.

**Phase 1B:** Deploy Plex, Sonarr, Radarr, Prowlarr and Seerr with **no external users** and test with permitted sample media. Confirm Plex scans and Seerr requests/status.

**Phase 1C:** Deploy qBittorrent with Gluetun/NordVPN, configure permitted sources, and verify kill-switch behavior and any Prowlarr privacy route.

**Phase 1D:** Connect Komga/ErsatzTV and turn the `#requests` UI preview into a **protected Glint request entrypoint** backed by authenticated server-side requests to Seerr, or initially a controlled link to Seerr. Add title discovery, season selection, per-user request history, anti-abuse controls, and entitlement checks. Fetch requests and statuses via Seerr, download progress/ETA via a restricted service that correlates Sonarr/Radarr queue items with qBittorrent records; never expose downloader credentials, torrent hashes, paths, trackers, Seerr/Arr API tokens, or other admin data to users. Before a transfer starts show no precise download ETA; while downloading show a qualified changing estimate, and after downloading show separate import/scan status. Don't imply the demo catalog is actual Plex availability.

**Acceptance checks:** Onboarding works; users without admin rights cannot alter automation; test request is approved and reaches correct manager; import goes to correct library; Plex sees imported test file; Seerr updates; VPN disconnect stops torrents; invalid remote access is rejected; on reboot stack resumes appropriately; backups can restore configurations.

## Upstream documentation

- [Seerr](https://docs.seerr.dev/) — modern successor to Overseerr and Jellyseerr.
- [Sonarr](https://wiki.servarr.com/sonarr), [Radarr](https://wiki.servarr.com/radarr), [Prowlarr](https://wiki.servarr.com/prowlarr) — official Servarr docs.
- [NordVPN's Gluetun guide](https://support.nordvpn.com/hc/en-us/articles/47830508425745-How-to-set-up-an-OpenVPN-manual-connection-to-NordVPN-with-Gluetun) — manual service credentials and container network arrangement.

This is a **plan**, not a live deployment or guarantee of anonymous torrenting.
