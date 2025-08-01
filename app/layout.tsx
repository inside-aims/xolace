// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/global.d.ts" />

import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import './globals.css';
import '../utils/pollfills'
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from './providers';
import { TooltipProvider } from '@/components/ui/tooltip';

export const viewport: Viewport = {
  maximumScale: 1
};

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s | Xolace',
    default: 'Xolace', // a default is required when creating a template
  },
  applicationName: 'Xolace',
  description:
    'Xolace is a social platform designed for users to share their thoughts, stories, and experiences freely, fostering peer to peer engagement, self-expression and professional mental healthcare support in a unique, user-centered, community-like space',
  keywords: [
    'Xolace',
    'Social',
    'Platform',
    'Thoughts',
    'Stories',
    'Experiences',
    'Fostering',
    'Engagement',
    'Self-Expression',
    'Unique',
    'User-Centered',
    'Space',
    'Communities',
    'Healthcare',
    'Mental healthcare',
    'Professional Support',
  ],
  creator: 'Xolace Inc.',
  publisher: 'Xolace Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title:
      'Xolace | Social experiencing platform with a touch of mental health support',
    description:
      'Xolace is a social platform designed for users to share their thoughts, stories, and experiences freely, fostering peer to peer engagement, self-expression and professional mental healthcare support in a unique, user-centered, community-like space',
    url: 'https://xolace.app',
    siteName: 'Xolace',
    images: [
      {
        url: '/assets/images/mas.webp',
        width: 1200,
        height: 630,
        alt: 'Xolace OG Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="dark:bg-bg-dark bg-bg text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <TooltipProvider>
              {children}
              <SpeedInsights />
              <Toaster />
              <SonnerToaster richColors />
            </TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
