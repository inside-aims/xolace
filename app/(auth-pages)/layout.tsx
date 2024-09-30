import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" overflow-y-auto overflow-x-hidden relative">
      {children}
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
        <p>
          Powered by{" "}
          <Link
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            AIMS
          </Link>
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
