
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: "Customize your experience with Xolace, including notifications, privacy settings, and more."
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {

  return (
    <main className="w-full items-center">
      {children}
    </main>
  );
}
