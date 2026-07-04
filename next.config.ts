import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in a parent dir otherwise
  // makes Next infer the wrong root directory.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
