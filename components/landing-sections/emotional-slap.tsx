"use client";

export const EmotionalSlapSection = () => {
  return (
    <section
      id="emotionalSlap"
      className="w-full px-4 md:px-8 py-20 md:py-36 bg-muted/50 dark:bg-card/40"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-20 md:mb-28">
          You&apos;ve felt this
        </h2>

        <div className="space-y-20 md:space-y-28">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Monday · 11:00 PM
            </span>
            <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-foreground/75 max-w-2xl">
              &ldquo;There&apos;s this tightness in your chest that won&apos;t
              go away. You don&apos;t know if you&apos;re anxious or sad or just
              tired. You open your phone and scroll, but nothing helps. You
              close it. The tightness is still there.&rdquo;
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-5">
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Friday · 10:30 PM
            </span>
            <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-foreground/75 max-w-2xl md:text-right">
              &ldquo;You&apos;ve been scrolling for an hour. Not looking for
              anything. Just… not ready to be alone with your thoughts. Everyone
              else seems fine. You wonder why you&apos;re not.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-24 md:mt-32 border-t border-border pt-10">
          <p className="text-xl md:text-2xl text-muted-foreground">
            That space.{" "}
            <span className="text-foreground font-medium">
              That&apos;s where Xolace lives.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
