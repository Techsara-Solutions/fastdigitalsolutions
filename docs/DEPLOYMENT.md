# Deployment — GitHub Actions → AWS EC2

The site is a folder of static HTML/CSS/JS files. Deployment therefore means
nothing more than _copying that folder onto a server that has a web server
pointed at it_. Everything below is a variation on that one idea.

**This deliberately deviates from PRD §23 (AWS Amplify) at the owner's
request** — the deviation is recorded in [ARCHITECTURE.md](ARCHITECTURE.md).

## Current production environment

| Item             | Value                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Public URL       | **https://fastdigitalsolutions.com** (and `www`), via Cloudflare                                                         |
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

## Domain and TLS — live since 2026-08-27

`fastdigitalsolutions.com` is served through **Cloudflare**, which terminates
TLS for visitors and proxies to this origin.

```
visitor ──HTTPS──> Cloudflare edge ──HTTPS──> nginx on EC2 :443
                   (public cert)              (Cloudflare Origin Certificate)
```

| Setting            | Value                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Nameservers        | `abby.ns.cloudflare.com`, `odin.ns.cloudflare.com`                                                              |
| Proxy              | Enabled (orange cloud) — visitors resolve to Cloudflare IPs                                                     |
| Origin certificate | Cloudflare Origin CA, covers `fastdigitalsolutions.com` + `*.fastdigitalsolutions.com`, **expires 23 Aug 2041** |
| Cert path          | `/etc/ssl/certs/fastdigitalsolutions.origin.pem` (`644` root)                                                   |
| Key path           | `/etc/ssl/private/fastdigitalsolutions.origin.key` (`600` root)                                                 |

### Why an Origin Certificate rather than Let's Encrypt

A Cloudflare Origin Certificate is trusted **only by Cloudflare**, not by
browsers — which is exactly right here, because Cloudflare is the only client
that ever connects to this origin. Visitors see Cloudflare's own
publicly-trusted certificate. It is valid for 15 years, so there is no 90-day
renewal timer to fail silently, and no HTTP-01 challenge to arrange around the
proxy.

### If the certificate ever needs replacing

Generate a new one at _Cloudflare → SSL/TLS → Origin Server → Create
Certificate_, then install it (the private key is shown **once** — keep a copy
in a password manager):

```bash
sudo install -m 600 -o root -g root /dev/null /etc/ssl/private/fastdigitalsolutions.origin.key
sudo tee /etc/ssl/private/fastdigitalsolutions.origin.key > /dev/null <<'EOF'
...paste key...
EOF
sudo install -m 644 -o root -g root /dev/null /etc/ssl/certs/fastdigitalsolutions.origin.pem
sudo tee /etc/ssl/certs/fastdigitalsolutions.origin.pem > /dev/null <<'EOF'
...paste certificate...
EOF

# The two MUST produce identical hashes, or nginx will refuse to start:
sudo openssl x509 -in /etc/ssl/certs/fastdigitalsolutions.origin.pem -noout -pubkey | openssl sha256
sudo openssl pkey -in /etc/ssl/private/fastdigitalsolutions.origin.key -pubout | openssl sha256

sudo nginx -t && sudo systemctl reload nginx
```

### Why port 80 still serves the site instead of redirecting

Two reasons: the deployment health check runs `curl http://127.0.0.1/` on the
instance, and in a CDN setup the visitor-facing HTTP→HTTPS redirect belongs at
the edge (_Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS_) rather
than at the origin.

### Remaining hardening

1. **Restrict the origin to Cloudflare.** `http://44.197.228.225/` is still
   reachable directly, which bypasses Cloudflare's protection and exposes the
   origin. Fix at the security group (strongest) by allowing 80/443 only from
   [Cloudflare's ranges](https://www.cloudflare.com/ips/), or at nginx with an
   allowlist. **Leave port 22 open** — GitHub Actions runners deploy over SSH
   from a wide dynamic range.
2. **Enable HSTS** once HTTPS has been stable for a few days:
   `bash /tmp/deploy/setup-ec2.sh --enable-hsts`. Browsers cache it
   aggressively, so it is painful to reverse.
3. **Pick one canonical host** (apex or `www`) and redirect the other (PRD §23.4).
4. **Set `NEXT_PUBLIC_SITE_URL`** and redeploy to switch on indexing, canonical
   URLs, the sitemap, and the Organization structured data.
5. **Restore real visitor IPs** in nginx logs with the `realip` module and
   Cloudflare's ranges — otherwise every log line shows a Cloudflare IP.
6. **Add the contact API origin** to `connect-src` and `form-action` in
   `/etc/nginx/security-headers.conf` once that endpoint exists.

### Troubleshooting: Cloudflare Error 521

"Web server is down" means Cloudflare could not open a TCP connection to the
origin. It is almost never an actual outage. Diagnose from outside:

```bash
curl -I http://<origin-ip>/          # origin alive on 80?
curl -kI https://<origin-ip>/        # origin answering TLS on 443?
```

If port 80 works but 443 is refused, Cloudflare's SSL/TLS mode is **Full** or
**Full (Strict)** — both connect to the origin over HTTPS — while nginx has no
443 listener. That was the cause on 2026-08-27, fixed by installing the Origin
Certificate above.

A quick way to tell a firewall block from a missing listener: a **refused**
connection (fast) means the security group allows the port but nothing is
listening; a **timeout** (slow) means the traffic is being dropped upstream.

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
