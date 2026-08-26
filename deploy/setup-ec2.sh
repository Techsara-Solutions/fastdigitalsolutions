#!/usr/bin/env bash
#
# One-time EC2 server preparation for the Fast Digital Solutions static site.
# Target: Ubuntu 22.04 / 24.04. Review before running; run as a sudo-capable
# user ON THE EC2 INSTANCE (not locally):
#
#   chmod +x setup-ec2.sh && ./setup-ec2.sh <deploy-user>
#
# <deploy-user> is the SSH user the GitHub Actions workflow connects as
# (default: ubuntu). See docs/DEPLOYMENT.md for the full runbook, including
# the security-group and TLS steps that cannot be scripted from here.

set -euo pipefail

DEPLOY_USER="${1:-ubuntu}"
DEPLOY_ROOT="/var/www/fastdigitalsolutions"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Installing nginx"
sudo apt-get update -y
sudo apt-get install -y nginx curl

echo "==> Creating deployment directory layout at ${DEPLOY_ROOT}"
sudo mkdir -p "${DEPLOY_ROOT}/releases"
# Placeholder page until the first pipeline deployment replaces it.
if [ ! -e "${DEPLOY_ROOT}/current" ]; then
  sudo mkdir -p "${DEPLOY_ROOT}/releases/bootstrap"
  echo "<!doctype html><title>Deployment pending</title><p>Awaiting first deployment.</p>" |
    sudo tee "${DEPLOY_ROOT}/releases/bootstrap/index.html" > /dev/null
  sudo ln -sfn "${DEPLOY_ROOT}/releases/bootstrap" "${DEPLOY_ROOT}/current"
fi
sudo chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_ROOT}"

echo "==> Installing nginx server block"
sudo cp "${SCRIPT_DIR}/nginx/fastdigitalsolutions.conf" /etc/nginx/sites-available/fastdigitalsolutions
sudo ln -sfn /etc/nginx/sites-available/fastdigitalsolutions /etc/nginx/sites-enabled/fastdigitalsolutions
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

echo "==> Done."
echo
echo "Remaining manual steps (docs/DEPLOYMENT.md):"
echo "  1. Security group: allow inbound TCP 80 and 443 (and 22 from trusted IPs only)."
echo "  2. Add the GitHub secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY[, EC2_PORT])."
echo "  3. When the domain exists: point DNS at this instance, set server_name in"
echo "     the nginx config, then run: sudo apt-get install -y certbot python3-certbot-nginx"
echo "     && sudo certbot --nginx  (and enable the HSTS header afterwards)."
