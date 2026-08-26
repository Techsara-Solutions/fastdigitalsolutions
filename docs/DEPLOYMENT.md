# Deployment — GitHub Actions → AWS EC2

This project deploys the static export (`out/`) to a single EC2 instance
running Nginx. **This deliberately deviates from PRD §23 (AWS Amplify) at the
owner's request** — the deviation and its implications are recorded in
[ARCHITECTURE.md](ARCHITECTURE.md).

## How it works

```
push to main
  → GitHub Actions (.github/workflows/deploy.yml)
      npm ci → npm run build (content gate + static export)
      tar out/ → scp to EC2:/tmp
      ssh: unpack into /var/www/fastdigitalsolutions/releases/<timestamp>-<sha>
           atomic symlink swap → /var/www/fastdigitalsolutions/current
           prune to the 5 newest releases
      health check (curl on the instance)
  → Nginx serves /var/www/fastdigitalsolutions/current
```

- **CI** (`.github/workflows/ci.yml`) runs on every PR and push to
  `hd-dev`/`dev`/`main`: format, lint, typecheck, unit tests, content-gated
  build, and Playwright E2E (including axe accessibility scans).
- **Deploy** runs only on pushes to `main` (or manually via _Run workflow_),
  and does nothing until the secrets below exist.

## One-time setup

### 1. EC2 instance

Any small instance works (t3.micro is plenty for a static site), Ubuntu
22.04/24.04 recommended. In the **security group**, allow inbound:

| Port | Purpose           | Source                            |
| ---- | ----------------- | --------------------------------- |
| 80   | HTTP              | 0.0.0.0/0                         |
| 443  | HTTPS (after TLS) | 0.0.0.0/0                         |
| 22   | SSH               | your IP(s) only — never 0.0.0.0/0 |

### 2. Server preparation

Copy the `deploy/` directory to the instance and run:

```bash
chmod +x deploy/setup-ec2.sh
./deploy/setup-ec2.sh ubuntu     # argument = the SSH deploy user
```

This installs Nginx, creates `/var/www/fastdigitalsolutions/{releases,current}`,
installs the server block from `deploy/nginx/fastdigitalsolutions.conf`
(security headers per PRD §23.6, caching, custom 404), and reloads Nginx.

### 3. GitHub secrets and variables

In the repository: **Settings → Secrets and variables → Actions**.

Secrets (required for deploys):

| Secret        | Value                                           |
| ------------- | ----------------------------------------------- |
| `EC2_HOST`    | Public IP or DNS of the instance                |
| `EC2_USER`    | SSH user (e.g. `ubuntu`)                        |
| `EC2_SSH_KEY` | Contents of the private key (PEM) for that user |
| `EC2_PORT`    | Optional; defaults to 22                        |

Prefer a **dedicated deploy key pair** over the instance's original key pair:
generate one (`ssh-keygen -t ed25519`), append the public key to
`~/.ssh/authorized_keys` on the instance, and store the private key as
`EC2_SSH_KEY`. Rotating it then never touches your personal access.

Variables (build-time page values, safe to be public — set when known):

| Variable                             | Value                                               |
| ------------------------------------ | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | `https://<the purchased domain>`                    |
| `NEXT_PUBLIC_CONTACT_API_URL`        | The contact API endpoint from the backend developer |
| `NEXT_PUBLIC_CONTACT_API_TIMEOUT_MS` | Optional; default 12000                             |

Until these are set the site builds with placeholders: every page is
`noindex`, the sitemap is empty, and the contact page shows the fallback state
— all intentional pre-launch behavior.

### 4. First deploy

Merge to `main` (hd-dev → dev → main per the branch flow) or trigger
**Deploy to EC2** manually from the Actions tab. Verify with
`curl -I http://<EC2_HOST>/`.

## Domain and TLS (when the domain is purchased)

1. Point the domain's A/AAAA records at the instance (an **Elastic IP** is
   strongly recommended so the address survives instance stops).
2. On the instance, set `server_name yourdomain.com www.yourdomain.com;` in
   `/etc/nginx/sites-available/fastdigitalsolutions`, then `sudo nginx -t && sudo systemctl reload nginx`.
3. `sudo apt-get install -y certbot python3-certbot-nginx && sudo certbot --nginx`
   — certbot configures 443 and the HTTP→HTTPS redirect and auto-renews.
4. Uncomment the `Strict-Transport-Security` header in the Nginx config
   (HSTS must only ever be served over HTTPS).
5. Decide the canonical host (apex vs `www`) and add a redirect server block
   for the other one (PRD §23.4).
6. Set the `NEXT_PUBLIC_SITE_URL` repository variable and redeploy — this
   turns on indexing, canonical URLs, the sitemap, and Organization JSON-LD.

## Rollback

Releases are kept on the server (`/var/www/fastdigitalsolutions/releases/`,
newest 5). To roll back instantly:

```bash
ssh <user>@<host>
ls -1t /var/www/fastdigitalsolutions/releases/      # pick the previous one
ln -sfn /var/www/fastdigitalsolutions/releases/<RELEASE> /var/www/fastdigitalsolutions/current.new
mv -Tf /var/www/fastdigitalsolutions/current.new /var/www/fastdigitalsolutions/current
```

No Nginx reload is needed. Alternatively, re-run the deploy workflow from a
known-good commit via _Run workflow_. Tag production releases in Git
(`git tag v1.x.y`) so known-good points are easy to find (PRD §23.9).

## Operational notes

- **Logs**: `sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log`.
- **Deploy failures** show in the Actions run; the previous release keeps
  serving traffic (the swap happens only after a successful unpack).
- **If the contact backend fails**, unset/blank `NEXT_PUBLIC_CONTACT_API_URL`
  and redeploy — the site switches to the documented phone fallback without
  going offline (PRD §23.9).
- **Ownership** (PRD §23.7): the AWS account, EC2 instance, domain, and this
  GitHub repository must be company-controlled; record who holds each. Do not
  give this repository or its workflows any AWS credentials — the pipeline
  only ever gets SSH access to the one instance.
