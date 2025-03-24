// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/global.d.ts" />

import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

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
    'Xolace is a social platform designed for users to share their thoughts, stories, and experiences freely, fostering both engagement and self-expression in a unique, user-centered space',
  keywords: ['Xolace', 'Social', 'Platform', 'Thoughts', 'Stories', 'Experiences', 'Fostering', 'Engagement', 'Self-Expression', 'Unique', 'User-Centered', 'Space'],
  creator: 'Atlas Innovations Meta Solutions',
  publisher: 'Atlas Innovations Meta Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
