import Link from "next/link";
import {DownloadButtons} from "@/components/shared/layoutUIs/download-buttons";

export function FinalCTASection() {
  return (
    <section className="w-full px-4 md:px-8 py-28 md:py-40 bg-foreground dark:bg-card relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, var(--color-primary) / 0.12, transparent)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
          Free · iOS & Android
        </p>

        <h2 className="text-5xl md:text-7xl font-bold text-background dark:text-foreground leading-tight">
          Carry it
          <br />
          with you
        </h2>

        <p className="text-lg text-background/60 dark:text-muted-foreground max-w-xs mx-auto">
          Free to download. Your first session takes 3 minutes.
        </p>

        <DownloadButtons />

        <p className="text-sm text-background/40 dark:text-muted-foreground/60">
          Or{" "}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-background/70 dark:hover:text-muted-foreground transition-colors"
          >
            continue to the web app
          </Link>
        </p>
      </div>
    </section>
  );
}
