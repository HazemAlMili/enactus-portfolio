import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for external avatar service
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable gzip compression
  compress: true,
  
  // Production optimizations
  reactStrictMode: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
