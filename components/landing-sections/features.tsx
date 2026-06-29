"use client";

export const FeaturesSection = () => {
  return (
    <section
      id="whyXolace"
      className="w-full px-4 md:px-8 py-20 md:py-36 bg-muted/50 dark:bg-card/40"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-10">
          Built on trust
        </p>

        <blockquote className="text-3xl md:text-5xl font-light italic leading-relaxed text-foreground/80">
          &ldquo;We built this because we&apos;ve sat in those same quiet, heavy
          rooms. Where something is wrong but nothing has a name. Where you need
          more than a scroll — but less than a diagnosis.&rdquo;
        </blockquote>

        <p className="text-base text-muted-foreground mt-10 font-medium">
          — The Xolace team
        </p>
      </div>
    </section>
  );
};
