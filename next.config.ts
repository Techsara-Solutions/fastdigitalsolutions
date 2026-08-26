import type { NextConfig } from "next";

/**
 * Hosts allowed to load Next.js dev resources (`/_next/*` and the HMR socket).
 * Next 16 blocks these cross-origin by default, which breaks opening the dev
 * server from another device on the LAN. Private/link-local ranges are matched
 * by wildcard so a new DHCP lease does not need a config change.
 */
function localNetworkDevOrigins(): string[] {
  const origins = [
    "localhost",
    "127.0.0.1",
    "10.*.*.*",
    "192.168.*.*",
    "169.254.*.*", // link-local (Tailscale/Wi-Fi adapters without a DHCP lease)
    "100.*.*.*", // Tailscale CGNAT range
    // RFC 1918 172.16.0.0/12, enumerated because the matcher wildcards per octet.
    ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
  ];

  const extra = (process.env.NEXT_DEV_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return [...origins, ...extra];
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: localNetworkDevOrigins(),
};

export default nextConfig;
