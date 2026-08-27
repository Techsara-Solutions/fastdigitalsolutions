#!/usr/bin/env bash
#
# Regenerates deploy/nginx/cloudflare-origin-lock.conf from Cloudflare's
# published IP ranges.
#
#   bash deploy/nginx/refresh-cloudflare-ips.sh
#
# Cloudflare changes these ranges occasionally. When they do, an origin locked
# to a stale list starts refusing a subset of real traffic — which presents as
# a partial, intermittent outage and is miserable to diagnose. Re-run this a
# couple of times a year, re-install the config, and reload nginx.
#
# IPv6 ranges are fetched but commented out: this instance has no global IPv6
# address, so Cloudflare only ever reaches it over IPv4. Uncomment them if that
# changes.

set -euo pipefail

OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cloudflare-origin-lock.conf"
V4_URL="https://www.cloudflare.com/ips-v4"
V6_URL="https://www.cloudflare.com/ips-v6"

V4="$(curl -fsS --max-time 30 "$V4_URL" | grep -E '^[0-9]' || true)"
V6="$(curl -fsS --max-time 30 "$V6_URL" | grep -E '^[0-9a-fA-F]' || true)"

if [ -z "$V4" ]; then
  echo "Could not fetch $V4_URL — refusing to write an empty allowlist." >&2
  exit 1
fi

{
  cat <<'HEADER'
# Origin lock + real visitor IP recovery for Cloudflare. HTTP CONTEXT.
#
# GENERATED FILE — do not edit by hand.
# Regenerate with: bash deploy/nginx/refresh-cloudflare-ips.sh
#
# Two jobs:
#
# 1. `set_real_ip_from` + `real_ip_header` replace $remote_addr with the real
#    visitor IP from Cloudflare's CF-Connecting-IP header. Without this every
#    access-log line records a Cloudflare address instead of a visitor.
#
# 2. The `geo` block decides whether a connection actually arrived through
#    Cloudflare, and the server blocks return 403 when it did not.
#
#    It is keyed on $realip_remote_addr, NOT $remote_addr, and that detail is
#    load-bearing. The realip module runs before the access phase, so by the
#    time an `allow`/`deny` rule is evaluated $remote_addr has already been
#    rewritten to the visitor's address — comparing that against Cloudflare's
#    ranges would 403 every genuine visitor. $realip_remote_addr preserves the
#    address nginx actually accepted the connection from.
HEADER

  echo "#"
  echo "# Generated from:"
  echo "#   $V4_URL"
  echo "#   $V6_URL"
  echo ""

  echo "# --- Trust Cloudflare's CF-Connecting-IP header ---------------------"
  while IFS= read -r cidr; do
    [ -n "$cidr" ] && echo "set_real_ip_from $cidr;"
  done <<< "$V4"
  echo ""
  echo "# IPv6 (this instance has no global IPv6 address; uncomment if it gains one)"
  while IFS= read -r cidr; do
    [ -n "$cidr" ] && echo "#set_real_ip_from $cidr;"
  done <<< "$V6"
  echo ""
  echo "real_ip_header CF-Connecting-IP;"
  echo ""

  echo "# --- Which connections are allowed to reach this origin -------------"
  echo "geo \$realip_remote_addr \$cf_origin_allowed {"
  echo "    default 0;"
  echo ""
  echo "    # Loopback: the deployment health check runs curl on the instance."
  echo "    127.0.0.1/32 1;"
  echo "    ::1/128      1;"
  echo ""
  echo "    # Cloudflare edge."
  while IFS= read -r cidr; do
    [ -n "$cidr" ] && printf '    %-20s 1;\n' "$cidr"
  done <<< "$V4"
  echo ""
  echo "    # IPv6 edge (see note above)."
  while IFS= read -r cidr; do
    [ -n "$cidr" ] && printf '    #%-19s 1;\n' "$cidr"
  done <<< "$V6"
  echo "}"
} > "$OUT"

echo "Wrote $OUT"
echo "  IPv4 ranges: $(printf '%s\n' "$V4" | grep -c .)"
echo "  IPv6 ranges: $(printf '%s\n' "$V6" | grep -c .) (commented out)"
echo ""
echo "Next: install it on the server and reload nginx —"
echo "  bash deploy/setup-ec2.sh   (or copy the conf files manually)"
