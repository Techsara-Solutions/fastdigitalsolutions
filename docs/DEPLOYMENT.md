# Deployment — GitHub Actions → AWS EC2

The site is a folder of static HTML/CSS/JS files. Deployment therefore means
nothing more than _copying that folder onto a server that has a web server
pointed at it_. Everything below is a variation on that one idea.

**This deliberately deviates from PRD §23 (AWS Amplify) at the owner's
request** — the deviation is recorded in [ARCHITECTURE.md](ARCHITECTURE.md).

## Current production environment

| Item             | Value                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| EC2 instance     | `i-00719a511f891b6d8` ("fastdigitalsolutions.com")                                                                       |
| Region           | `us-east-1`                                                                                                              |
| Instance type    | `t2.small` (2 GB RAM, 8 GB disk)                                                                                         |
| Operating system | **Amazon Linux 2023**                                                                                                    |
| SSH user         | **`ec2-user`**                                                                                                           |
| Public IPv4      | `44.197.228.225` — ⚠️ **auto-assigned, not an Elastic IP**                                                               |
| Public DNS       | `ec2-44-197-228-225.compute-1.amazonaws.com`                                                                             |
| Web server       | nginx 1.30.4                                                                                                             |
| Document root    | `/var/www/fastdigitalsolutions/current` (symlink)                                                                        |
| SSH key          | `fastdigitalsolutions.com.pem` — held by the owner outside the repo; GitHub has its own copy as the `EC2_SSH_KEY` secret |

> ⚠️ **Allocate an Elastic IP.** The current public IP is auto-assigned, which
> means it **changes if the instance is ever stopped and started**. That would
> break both the `EC2_HOST` secret and (later) your DNS records. In the AWS
> console: _EC2 → Elastic IPs → Allocate_, then _Associate_ it with this
> instance, and update the `EC2_HOST` secret to the new address.

## How the pipeline works

```
push to main
  → GitHub Actions (.github/workflows/deploy.yml)
      job 1 "CI gate"  — calls ci.yml as a reusable workflow
          quality: format, lint, typecheck, unit tests, content gate, build
                   → publishes out/ as the "site-build" artifact
          e2e:     Playwright + axe-core (built separately with a mock API)
      job 2 "Deploy"   — needs: ci   (cannot start until every check passes)
          download the "site-build" artifact  (no rebuild)
          tar → scp to EC2:/tmp/site.tar.gz
          record the currently live release   (for rollback)
          ssh: unpack to releases/<timestamp>-<sha>
               atomically re-point the `current` symlink at it
               prune to the 5 newest releases
          health check (curl on the instance)
          on failure: restore the previously live release
  → nginx serves /var/www/fastdigitalsolutions/current
```

Three properties are deliberate:

**Deploy is gated on CI.** The two used to run in parallel on push to main,
which meant a commit with failing tests or type errors would deploy while CI
turned red beside it. `deploy` now declares `needs: ci`, so nothing reaches
production until every check is green. The gate lives in the workflow because
repository branch protection is not available on the current GitHub plan.

**Build once, deploy what was tested.** CI publishes the production build as an
artifact and the deploy job downloads that exact artifact. Previously each
workflow built the site independently, so the bytes that shipped were never
literally the bytes that passed the tests. As a side effect the deploy job needs
neither a checkout nor Node, and finishes in about ten seconds.

**The symlink swap makes releases atomic.** Rather than overwriting the live
directory — during which visitors would see a half-written site — each
deployment unpacks into a brand-new directory and then moves a symlink. `mv -T`
is atomic on Linux, so every request is served either entirely by the old
release or entirely by the new one, never a mixture. It also makes rollback
instant, because the previous release is still sitting on disk untouched.

### Automatic rollback

The symlink is swapped before the health check runs, so a failed check would
otherwise leave a broken release live. The workflow therefore records what was
live beforehand and restores it if anything after the swap fails. A rollback
still reports the run as failed — it prevents a bad release from serving, it
does not pretend the deployment succeeded.

Rehearse it any time without risk, from _Actions → Deploy to EC2 → Run
workflow_, ticking **simulate_health_check_failure**:

```bash
gh workflow run deploy.yml -f simulate_health_check_failure=true
```

That deploys a perfectly good build, forces the health check to fail, and
confirms the previous release is restored — so the rollback path is exercised
on a normal day rather than for the first time during an incident. Verified
2026-08-27: restored the prior release and returned `post-rollback HTTP 200`.

Afterwards, run the workflow again normally to move back to the newest release.

> Because deploy.yml calls ci.yml for main, **CI no longer triggers separately
> on push to main** — it appears as the "CI gate" job inside the deploy run.
> It still runs standalone for `dev`, `hd-dev`, and every pull request.

## Server directory layout

```
/var/www/fastdigitalsolutions/
├── releases/
│   ├── bootstrap/                     placeholder from the initial setup
│   ├── 20260826185249-5877ef2/        one directory per deployment
│   └── …                              (newest 5 kept)
└── current -> releases/20260826185249-5877ef2
```

## Doing it manually (the same steps, by hand)

Useful for understanding, or if GitHub is unavailable. Run from the project root:

```bash
# 1. Build the static site
npm run build

# 2. Package it
tar czf /tmp/site.tar.gz -C out .

# 3. Copy it to the server
scp -i fastdigitalsolutions.com.pem /tmp/site.tar.gz ec2-user@44.197.228.225:/tmp/

# 4. Unpack + activate on the server
ssh -i fastdigitalsolutions.com.pem ec2-user@44.197.228.225 '
  set -euo pipefail
  ROOT=/var/www/fastdigitalsolutions
  RELEASE=$(date -u +%Y%m%d%H%M%S)-manual
  mkdir -p "$ROOT/releases/$RELEASE"
  tar xzf /tmp/site.tar.gz -C "$ROOT/releases/$RELEASE"
  rm -f /tmp/site.tar.gz
  ln -sfn "$ROOT/releases/$RELEASE" "$ROOT/current.new"
  mv -Tf "$ROOT/current.new" "$ROOT/current"
  echo "live: $(readlink $ROOT/current)"
'
```

## One-time server setup (already completed)

Recorded for reproducibility — you do **not** need to run this again unless
you rebuild the server.

```bash
scp -i fastdigitalsolutions.com.pem -r deploy ec2-user@44.197.228.225:/tmp/
ssh -i fastdigitalsolutions.com.pem ec2-user@44.197.228.225 \
  "find /tmp/deploy -type f \( -name '*.sh' -o -name '*.conf' \) -exec sed -i 's/\r$//' {} + && bash /tmp/deploy/setup-ec2.sh"
```

`deploy/setup-ec2.sh` detects the distribution (`dnf` vs `apt`), installs
nginx, creates the release directory layout, installs the configuration, and
starts the service. It is safe to re-run.

The `sed 's/\r$//'` step strips Windows carriage returns. Shell scripts
written on Windows fail on Linux with confusing `bad interpreter` or
`command not found` errors if this is skipped.

### Why the distro's `nginx.conf` is replaced

Amazon Linux (like Ubuntu) ships a default `server { listen 80; … }` block
serving a placeholder page. Two server blocks competing for port 80 makes the
winner ambiguous, so `deploy/nginx/nginx.conf` deliberately contains **no**
server block — it only sets global options and includes `conf.d/`. That makes
the site's own block in `conf.d/fastdigitalsolutions.conf` the single,
explicit `default_server`. The distribution's original is preserved at
`/etc/nginx/nginx.conf.distro-orig`.

### Why security headers are in an `include` file

nginx has a sharp edge: a `location` block inherits `add_header` from its
parent **only until it declares an `add_header` of its own** — at which point
it silently loses every inherited header. Since the caching blocks must set
`Cache-Control`, they would otherwise drop all security headers. Hence
`/etc/nginx/security-headers.conf`, explicitly `include`d in each block.

## GitHub secrets and variables

Set at _Settings → Secrets and variables → Actions_.

Secrets — **already configured**:

| Secret        | Value                                      |
| ------------- | ------------------------------------------ |
| `EC2_HOST`    | `44.197.228.225`                           |
| `EC2_USER`    | `ec2-user`                                 |
| `EC2_SSH_KEY` | contents of `fastdigitalsolutions.com.pem` |

They were set with the GitHub CLI, reading the key straight from disk so it
never passed through a terminal or chat message:

```bash
gh secret set EC2_HOST --body "44.197.228.225"
gh secret set EC2_USER --body "ec2-user"
gh secret set EC2_SSH_KEY < fastdigitalsolutions.com.pem
```

Variables (build-time page values, not secret) — **set these when known**:

| Variable                             | Value                               |
| ------------------------------------ | ----------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | `https://<the purchased domain>`    |
| `NEXT_PUBLIC_CONTACT_API_URL`        | endpoint from the backend developer |
| `NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS` | optional; default 12000             |

Until `NEXT_PUBLIC_SITE_URL` is set, every page ships `noindex` and
`robots.txt` disallows all crawlers. That is intentional: it stops search
engines indexing the site at its raw IP address before the real domain exists.

## Domain and TLS (when the domain is purchased)

1. Allocate an **Elastic IP** first (see the warning above), then point the
   domain's A record at it.
2. On the server, edit `/etc/nginx/conf.d/fastdigitalsolutions.conf` and set
   `server_name fastdigitalsolutions.com www.fastdigitalsolutions.com;`, then
   `sudo nginx -t && sudo systemctl reload nginx`.
3. Install certbot and issue the certificate:
   ```bash
   sudo dnf install -y certbot python3-certbot-nginx
   sudo certbot --nginx
   ```
   Certbot adds the 443 listener and the HTTP→HTTPS redirect, and installs a
   renewal timer.
4. Enable HSTS **only now that TLS works**:
   `bash /tmp/deploy/setup-ec2.sh --enable-hsts`
5. Pick one canonical host (apex or `www`) and redirect the other (PRD §23.4).
6. Set the `NEXT_PUBLIC_SITE_URL` variable and redeploy — this switches on
   indexing, canonical URLs, the sitemap, and the Organization structured data.
7. Add the contact API origin to `connect-src` and `form-action` in
   `/etc/nginx/security-headers.conf` once that endpoint exists.

## Rollback

The previous releases are still on disk, so rollback is a symlink move:

```bash
ssh -i fastdigitalsolutions.com.pem ec2-user@44.197.228.225
ls -1t /var/www/fastdigitalsolutions/releases/     # pick the previous one
ROOT=/var/www/fastdigitalsolutions
ln -sfn "$ROOT/releases/<RELEASE>" "$ROOT/current.new"
mv -Tf "$ROOT/current.new" "$ROOT/current"
```

No nginx reload needed. Alternatively re-run the deploy workflow from a
known-good commit. Tag production releases (`git tag v1.x.y`) so good points
are easy to find (PRD §23.9).

## Troubleshooting

### `TypeError: Invalid URL` during the deploy build

Fixed on 2026-08-27, recorded here because the underlying trap is easy to
reintroduce.

GitHub Actions substitutes an **empty string** for an unset `${{ vars.X }}`
reference — it does not leave the variable undefined. Code of the form
`process.env.X ?? fallback` therefore does **not** fall back: an empty string
is neither `null` nor `undefined`, so it passes straight through, and
`new URL("")` throws.

Two safeguards now exist:

- `readEnv()` in `src/content/site.ts` treats blank and whitespace-only values
  as absent, and `isPlaceholder()` reports them as placeholders.
- `ci.yml` builds with the same repository variables `deploy.yml` uses. The
  original bug survived CI precisely because CI built without them, so the two
  workflows were not exercising the same code path.

**Rule of thumb:** when reading configuration from CI, test for _blank_, not
just for _undefined_.

### Deploy fails at the SSH or upload step

Usually the `EC2_HOST` secret no longer matches the instance. If the instance
was stopped and started, its auto-assigned public IP changed — allocate an
Elastic IP and update the secret.

### The site serves an old version

Check what the symlink points at:
`ssh … 'readlink /var/www/fastdigitalsolutions/current'`. If it points at the
newest release but browsers disagree, it is a client cache — HTML is served
`Cache-Control: no-cache`, so a hard refresh should resolve it.

## Operational notes

- **Logs**: `sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log`
- **nginx status**: `sudo systemctl status nginx`
- **Config test after any edit**: `sudo nginx -t` before reloading — it
  catches syntax errors before they can take the site down.
- **Deploy failures** surface in the Actions tab; the previous release keeps
  serving, because the symlink only moves after a successful unpack.
- **If the contact backend fails**, clear the `NEXT_PUBLIC_CONTACT_API_URL`
  variable and redeploy — the site falls back to the documented phone path
  rather than going offline (PRD §23.9).
- **Ownership** (PRD §23.7): the AWS account, instance, domain, and repository
  must be company-controlled. Note that this pipeline is given **only SSH
  access to one instance** — no AWS credentials are stored in GitHub.
- **Security group**: ports 80 and 443 open to the world, port 22 should be
  restricted to trusted IPs only.
