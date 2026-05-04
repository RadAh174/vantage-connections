import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lock Turbopack workspace root to this project so a stray lockfile
  // higher up the tree doesn't get picked up.
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
