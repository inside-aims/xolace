import type { Metadata } from 'next';
import AboutLeftSidebar from "@/components/shared/layoutUIs/AboutLeftSidebar";

export const metadata: Metadata = {
  title: 'About',
}

export default async function AboutUiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-row bg-white dark:bg-black">
      <div className="hidden md:block fixed top-0 h-screen overflow-y-auto">
        <AboutLeftSidebar/>
      </div>
      <div className="flex-1 overflow-y-auto md:pl-[110px] lg:pl-[240px] bg-white dark:bg-black">
        {children}
      </div>
    </main>
  );
}
