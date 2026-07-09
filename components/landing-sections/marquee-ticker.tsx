"use client";

const row1 = [
  "Mirror",
  "Echo",
  "Safety",
  "Private by design",
  "Anonymous, always",
  "No followers. No feed.",
  "No ads. No data sold.",
  "Free to download",
  "3 min first session",
  "4.9 ★ App Store",
  "Available on iOS & Android",
];

const row2 = [
  "A quiet place to be human",
  "Not a social platform",
  "Not therapy",
  "Not a chatbot",
  "The space before, between, and outside",
  "Encrypted",
  "No human review",
  "You are not alone",
  "Say what's true",
  "For the moments that don't have a name yet",
];

function MarqueeRow({
  phrases,
  reverse = false,
}: {
  phrases: string[];
  reverse?: boolean;
}) {
  const doubled = [...phrases, ...phrases];
  return (
    <div className="overflow-hidden">
      <div
        className="flex whitespace-nowrap w-max"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${reverse ? "35s" : "28s"} linear infinite`,
        }}
      >
        {doubled.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="inline-flex items-center mx-5 text-sm font-medium text-muted-foreground/70"
          >
            {phrase}
            <span className="ml-5 text-primary/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarqueeTicker() {
  return (
    <div className="w-full border-y border-border bg-muted/30 dark:bg-card/30 py-4 space-y-3">
      <MarqueeRow phrases={row1} />
      <MarqueeRow phrases={row2} reverse />
    </div>
  );
}
