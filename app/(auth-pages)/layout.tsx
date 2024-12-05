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
      <footer className="w-full flex items-center justify-center flex-col border-t mx-auto text-center text-xs py-10">
        <div className="flex items-center justify-center gap-8">
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
        </div>
        <div className=" text-lg text-amber-500 font-bold">
          BETA
        </div>
      </footer>
    </main>
  );
}
