# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.5] - 2026-08-10

### Fixed

#### moosh plugin-list returns nothing
- **Missing `vendor/autoload.php`**: moosh 1.27 GitHub release tarball does not
  include Composer dependencies. Added `composer install` to the phpfpm
  Dockerfile so `vendor/autoload.php` is generated at image build time.
- **403 Forbidden from `download.moodle.org`**: PHP's `file_get_contents()`
  sends no `User-Agent` header by default, and moodle.org blocks requests
  without one. Added `user_agent = "Moosh/1.27 (Moodle)"` to php.ini in
  `chart/etc/php.ini` (chart default) and `template/phpfpm-docker/etc/php.ini`.
  The runtime php.ini is served via ConfigMap from `.Values.etc.php`.

#### Image registry migrated from localhost:32000 to registry.dive4dec
- `localhost:32000` (MicroK8s built-in registry) is only accessible from the
  node running the registry. Switched to `registry.dive4dec` (ClusterIP service)
  so images can be pulled from any node in the cluster, enabling pod migration
  during node drain.

## [0.4.4] - 2026-08-10

### Fixed

#### SSE streaming broken through ingress-nginx
- **`proxy-buffering` enabled by default** in ingress-nginx caused Server-Sent
  Events (SSE) responses from the Hermes Agent chat to be buffered at the
  ingress layer. The browser's `EventSource` received nothing until the
  connection closed, so the chat showed empty assistant bubbles even though
  the bridge was running and responding.
- **Fix:** Set `nginx.ingress.kubernetes.io/proxy-buffering: "off"` as a
  default annotation in the nginx subchart values. This ensures SSE responses
  are streamed to the browser in real-time without buffering.

## [0.4.3] - 2026-08-09

### Fixed

#### Moodle cron false "not been run" warning
- **`cron_last` never updated** — Moodle 5.x `admin/cli/cron.php` does NOT set
  the legacy `cron_last` config setting. The admin dashboard warning ("cron has
  not been run for X days") checks this value, but it was never written. Fixed
  by adding `cron-post.php` — a small PHP script that runs after `cron.php` and
  calls `set_config('cron_last', time())`.
- **`cron_keepalive=180` blocking job exit** — Moodle 5.x defaults the cron
  keep-alive loop to 180 seconds. The K8s CronJob pod ran for 3 minutes before
  being killed, preventing any post-cron commands from executing.
  `cron-post.php` sets `cron_keepalive=0` so `cron.php` exits immediately after
  running tasks (sub-second completion instead of 3-minute loop).
- **H5P content types task blocking cron** — `core\task\h5p_get_content_types_task`
  fetches from `h5p.org/sites/default/files/h5p/content-types.json`, which now
  returns 404. The task threw `invalid_response_exception` on every run, blocking
  all subsequent scheduled tasks. `cron-post.php` disables this task (0 H5P
  content on both instances; libraries can be uploaded manually if needed).

### Added
- `e-quiz/chart/etc/cron-post.php` — post-cron PHP script that sets
  `cron_last`, `cron_keepalive=0`, and disables the H5P task.
- `e-quiz/chart/templates/configmap-etc.yaml` — added `cron-post.php` entry
  to the `etc` ConfigMap.
- `e-quiz/chart/templates/cronjob.yaml` — cron container command now calls
  `php /etc/moodle/cron-post.php` after `cron.php`; added volumeMount for
  `cron-post.php` via subPath.

## [0.4.2] - 2026-07-25

### Fixed
- **nginx 502 on phpfpm pod recreation** — The nginx liveness/readiness
  probes were `tcpSocket` (only checked if port 80 was open), so nginx
  reported healthy even when returning 502 to all clients. Changed to
  `httpGet /login/index.php` which checks the full nginx → PHP-FPM chain.
  When phpfpm is unreachable, nginx returns 502, the probe fails, and k8s
  auto-restarts nginx (which re-resolves the phpfpm DNS via resolv.conf
  search domains → picks up the new pod IP).
  
  Note: An nginx `resolver` + variable approach was also attempted but
  reverted — nginx's resolver directive does NOT honor resolv.conf search
  domains, so the bare name `phpfpm` can't be resolved. Using the FQDN
  would hardcode the namespace, which conflicts with the chart's
  namespace-agnostic design.

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
