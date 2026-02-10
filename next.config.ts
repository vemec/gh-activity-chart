import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/chart/**',
        search: '**',
      },
    ],
  },
};

export default nextConfig;
