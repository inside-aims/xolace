/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_BUNNY_HOST_NAME}`,
        pathname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  transpilePackages: ['next-mdx-remote']
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })

module.exports = withBundleAnalyzer(nextConfig);
