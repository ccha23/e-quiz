# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **nginx 502 on phpfpm pod recreation** — Two-part fix for the recurring
  502 outages when phpfpm-0 is recreated (new pod IP):
  - Added `resolver 10.152.183.10 valid=5s` + `set $upstream_phpfpm phpfpm`
    to nginx config. nginx now re-resolves the phpfpm DNS every 5 seconds
    instead of caching the pod IP forever. This is required because the
    phpfpm service is headless (`clusterIP: None`) — DNS returns the pod
    IP directly, which changes on pod recreation.
  - Changed nginx liveness/readiness probes from `tcpSocket` (only checks
    if port 80 is open) to `httpGet /login/index.php` (checks the full
    nginx → PHP-FPM chain). When phpfpm is unreachable, nginx returns 502,
    the probe fails, and k8s restarts nginx (which re-resolves DNS).

## [0.4.1] - 2026-07-16

### Fixed
- **nginx config** — `fastcgi_pass phpfpm:9000` now uses plain service name.
  Previous attempt to use nginx `resolver` directive with FQDN
  (`phpfpm.<namespace>.svc.cluster.local`) was reverted — it hardcoded the
  cluster domain and namespace. The headless service (`clusterIP: None`) is
  retained; nginx caches the pod IP at startup. Restart the nginx pod if
  `phpfpm-0` is restarted.

## [0.4.0] - 2026-07-16

### Added
- **Composer dependency installation** in html-docker Dockerfile — installs PHP CLI,
  Composer, and runs `composer install --ignore-platform-reqs` to generate `vendor/`
  at build time. Fixes Moodle environment checks "Composer installed data not found"
  and "Router not configured".
- **`$CFG->routerconfigured = true`** in setup_moodle.sh.j2 — marks the Moodle Router
  (r.php / Slim) as configured since nginx already falls through to r.php via
  `try_files`. Makes the "Router not configured" environment check pass.

### Fixed
- **Moosh download** — moodle.org returns 403 (Cloudflare blocks wget/curl). Switched
  to GitHub release (`tmuras/moosh` tag 1.27 tarball) instead of moodle.org zip.
- **Moodle download URL** — reverted to GitHub tag download (from official download
  page which 404s). The `vendor/` gap is now filled by `composer install` in the
  Dockerfile instead.

### Changed
- **html-docker Dockerfile** — added `php83-cli`, `php83-phar`, `php83-openssl`,
  `php83-mbstring`, `php83-ctype`, `php83-tokenizer`, `php83-fileinfo` packages
  and Composer installation to enable `composer install` at build time.

## [0.3.0] - 2026-06-11

### Added
- Initial Helm chart for e-quiz (Moodle + CodeRunner + STACK + Goemaxima + Jobe).
- html-docker and phpfpm-docker Dockerfile templates.
- Configurator Docker app for rendering per-deployment values.
