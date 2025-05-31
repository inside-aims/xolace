// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/global.d.ts" />

import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import {Toaster as SonnerToaster} from 'sonner'
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from './providers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
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
    "Mental healthcare",
    'Professional Support'
  ],
  creator: 'Xolace Inc.',
  publisher: 'Xolace Inc.',
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
          {children}
          <SpeedInsights />
          <Toaster />
          <SonnerToaster richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
