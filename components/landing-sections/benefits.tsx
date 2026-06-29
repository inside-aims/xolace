"use client";

const promises = [
  {
    id: "private",
    title: ["Private", "by design"],
    description:
      "Encrypted in transit and at rest. No one on the team reads your sessions. Ever.",
  },
  {
    id: "anon",
    title: ["Anonymous,", "always"],
    description:
      "Your name is never attached to what you feel. You are not profiled, tracked, or targeted.",
  },
  {
    id: "feed",
    title: ["No followers,", "no feed"],
    description:
      "No audience. No performance. You show up for yourself — not for anyone watching.",
  },
  {
    id: "ads",
    title: ["No ads,", "no data sold"],
    description: "Your trust is the product — not your data.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="w-full py-16 md:py-28">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-14 md:mb-20">
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5">
          Sealed
        </p>
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Our promises
          <br />
          to you
        </h2>
        <p className="text-xl text-muted-foreground mt-4 max-w-sm">
          When you&apos;re at your most honest, you deserve to feel safe.
        </p>
      </div>

      {/* Full-width bands */}
      <div className="border-t border-border">
        {promises.map(({ id, title, description }, i) => (
          <div
            key={id}
            className={`border-b border-border py-10 md:py-14 px-4 md:px-8 lg:px-16 xl:px-24 flex flex-col md:flex-row md:items-center gap-8 transition-colors duration-300 hover:bg-muted/30 dark:hover:bg-card/30 ${
              i % 2 === 1 ? "bg-muted/20 dark:bg-card/20" : ""
            }`}
          >
            <div className="md:w-5/12">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {title[0]}
                <br />
                {title[1]}
              </h3>
            </div>

            <div className="hidden md:block w-px h-16 bg-border shrink-0" />

            <div className="md:w-7/12 md:pl-8">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
        <p className="text-sm text-muted-foreground italic">
          The foundation, not a feature.{" "}
          <span className="not-italic">Signed, in good faith. v 1.0</span>
        </p>
      </div>
    </section>
  );
};
