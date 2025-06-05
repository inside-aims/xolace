// import { ThemeSwitcher } from '@/components/theme-switcher';
// import Link from 'next/link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-y-auto overflow-x-hidden">
      {children}
      {/*<footer className="mx-auto flex w-full flex-col items-center justify-center border-t h-30 text-center text-xs dark:bg-bg-dark">*/}
      {/*  <div className="flex items-center justify-center gap-8">*/}
      {/*    <p>*/}
      {/*      Powered by{' '}*/}
      {/*      <Link*/}
      {/*        href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"*/}
      {/*        target="_blank"*/}
      {/*        className="font-bold hover:underline"*/}
      {/*        rel="noreferrer"*/}
      {/*      >*/}
      {/*        AIMS*/}
      {/*      </Link>*/}
      {/*    </p>*/}
      {/*    <ThemeSwitcher />*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </main>
  );
}
