import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "calcuttafreshfoods.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
