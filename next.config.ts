import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const storageURL = process.env.S3_PUBLIC_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (storageURL) {
  try {
    const url = new URL(storageURL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    });
  } catch {
    // Runtime environment validation reports malformed storage URLs.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  serverExternalPackages: ["sharp"],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
