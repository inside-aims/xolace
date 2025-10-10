/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_BUNNY_HOST_NAME}`,
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '**',
      },
    ],
    domains: ["qdjrwasidlmgqxakdxkl.supabase.co"],
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  transpilePackages: ['next-mdx-remote'],
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Then wrap Sentry around it
export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    org: "dproject",
    project: "xolace-v1",
    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    reactComponentAnnotation: {
      enabled: true,
    },

    // Automatically tree-shake Sentry logger statements
    disableLogger: true,
  }
);
