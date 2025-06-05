/** @type {import('next').NextConfig} */
const nextConfig = {
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
