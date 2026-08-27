#!/usr/bin/env bash
#
# One-time server preparation for the Fast Digital Solutions static site.
#
# Supports Amazon Linux 2023 (dnf) and Debian/Ubuntu (apt). Run it ON the EC2
# instance, as a user with sudo rights:
#
#   scp -i <key>.pem -r deploy ec2-user@<host>:/tmp/
#   ssh -i <key>.pem ec2-user@<host> 'bash /tmp/deploy/setup-ec2.sh'
#
# The script is idempotent: running it again re-installs the configuration
# without disturbing existing releases.
#
# Optional flags:
#   --enable-hsts   uncomment the HSTS header (ONLY after TLS is active)

set -euo pipefail

DEPLOY_ROOT="/var/www/fastdigitalsolutions"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_USER="$(whoami)"
ENABLE_HSTS=false

for arg in "$@"; do
  case "$arg" in
    --enable-hsts) ENABLE_HSTS=true ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

# ---------------------------------------------------------------- 1. Detect OS
if command -v dnf > /dev/null 2>&1; then
  PKG_INSTALL="sudo dnf install -y"
  NGINX_USER="nginx"
  OS_LABEL="Amazon Linux / RHEL family (dnf)"
elif command -v apt-get > /dev/null 2>&1; then
  PKG_INSTALL="sudo apt-get install -y"
  NGINX_USER="www-data"
  OS_LABEL="Debian / Ubuntu (apt)"
  sudo apt-get update -y
else
  echo "Unsupported distribution: neither dnf nor apt-get found." >&2
  exit 1
fi

echo "==> Detected ${OS_LABEL}; nginx will run as '${NGINX_USER}'"

# ------------------------------------------------------------- 2. Install nginx
if ! command -v nginx > /dev/null 2>&1; then
  echo "==> Installing nginx"
  ${PKG_INSTALL} nginx
else
  echo "==> nginx already installed ($(nginx -v 2>&1))"
fi

# ------------------------------------------------- 3. Release directory layout
#
#   /var/www/fastdigitalsolutions/
#   ├── releases/<timestamp>-<sha>/   one directory per deployment
#   └── current -> releases/<newest>  symlink that nginx serves
#
echo "==> Preparing ${DEPLOY_ROOT}"
sudo mkdir -p "${DEPLOY_ROOT}/releases"

if [ ! -e "${DEPLOY_ROOT}/current" ]; then
  sudo mkdir -p "${DEPLOY_ROOT}/releases/bootstrap"
  echo '<!doctype html><meta charset="utf-8"><title>Deployment pending</title><p>Server ready. Awaiting first deployment.</p>' |
    sudo tee "${DEPLOY_ROOT}/releases/bootstrap/index.html" > /dev/null
  sudo ln -sfn "${DEPLOY_ROOT}/releases/bootstrap" "${DEPLOY_ROOT}/current"
fi

# The deploy user owns the tree (the pipeline writes here over SSH); nginx only
# needs to read it, which it does through the world-readable execute bits.
sudo chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_ROOT}"
sudo chmod 755 /var/www "${DEPLOY_ROOT}"

# ------------------------------------------------------- 4. Install nginx config
echo "==> Installing nginx configuration"

# Preserve the distribution's original main config once, for reference.
if [ ! -f /etc/nginx/nginx.conf.distro-orig ]; then
  sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.distro-orig
  echo "    (original saved to /etc/nginx/nginx.conf.distro-orig)"
fi

sudo install -m 644 "${SCRIPT_DIR}/nginx/nginx.conf" /etc/nginx/nginx.conf
sudo sed -i "s/^user nginx;/user ${NGINX_USER};/" /etc/nginx/nginx.conf

sudo install -m 644 "${SCRIPT_DIR}/nginx/security-headers.conf" /etc/nginx/security-headers.conf
sudo install -m 644 "${SCRIPT_DIR}/nginx/site-locations.conf" /etc/nginx/site-locations.conf
sudo mkdir -p /etc/nginx/conf.d
sudo install -m 644 "${SCRIPT_DIR}/nginx/fastdigitalsolutions.conf" \
  /etc/nginx/conf.d/fastdigitalsolutions.conf

# The HTTPS server block references the Cloudflare Origin Certificate. If it is
# not installed yet, nginx would fail to start and take the site down with it —
# so fall back to an HTTP-only config and say so plainly.
if ! sudo test -f /etc/ssl/certs/fastdigitalsolutions.origin.pem ||
  ! sudo test -f /etc/ssl/private/fastdigitalsolutions.origin.key; then
  echo "    TLS certificate not found — installing HTTP-only config."
  echo "    (see docs/DEPLOYMENT.md → 'TLS via Cloudflare Origin Certificate')"
  sudo sed -i '/^# ---* HTTPS (443)/,$d' /etc/nginx/conf.d/fastdigitalsolutions.conf
fi

# Remove Debian/Ubuntu's default site, which would otherwise also claim port 80.
sudo rm -f /etc/nginx/sites-enabled/default

if [ "${ENABLE_HSTS}" = true ]; then
  echo "==> Enabling HSTS header"
  sudo sed -i 's|^#add_header Strict-Transport-Security|add_header Strict-Transport-Security|' \
    /etc/nginx/security-headers.conf
fi

# ------------------------------------------------------------ 5. Validate/start
echo "==> Validating configuration"
sudo nginx -t

echo "==> Starting nginx"
sudo systemctl enable nginx > /dev/null 2>&1 || true
sudo systemctl restart nginx

echo "==> Local response check"
curl -fsS -o /dev/null -w "    http://127.0.0.1/ → HTTP %{http_code}\n" http://127.0.0.1/

cat <<'DONE'

==> Server setup complete.

Remaining steps (see docs/DEPLOYMENT.md):
  1. Security group: allow inbound TCP 80 and 443; restrict 22 to trusted IPs.
  2. Add GitHub secrets EC2_HOST, EC2_USER, EC2_SSH_KEY to enable the pipeline.
  3. Allocate an Elastic IP so the address survives an instance stop/start.
  4. When the domain exists: set server_name, run certbot --nginx, then re-run
     this script with --enable-hsts.
DONE
