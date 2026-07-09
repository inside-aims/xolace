import Image from "next/image";
import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/gh/app/xolace/id6761601429";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.xolaceincorg.xolace";

type DownloadButtonsProps = {
  className?: string;
  align?: "start" | "center";
};

export function DownloadButtons({
  className,
  align = "center",
}: DownloadButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Xolace on the App Store"
        className="transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
      >
        <Image
          src="/images/app-store-mobile.png"
          alt="Download on the App Store"
          width={160}
          height={53}
          className="h-11 w-auto dark:hidden"
        />
        <Image
          src="/images/app-store-mobile-dark.png"
          alt="Download on the App Store"
          width={160}
          height={53}
          className="hidden h-11 w-auto dark:block"
        />
      </a>

      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Xolace on Google Play"
        className="transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
      >
        <Image
          src="/images/play-store-light.png"
          alt="Get it on Google Play"
          width={160}
          height={53}
          className="h-11 w-auto dark:hidden"
        />
        <Image
          src="/images/play-store-dark.png"
          alt="Get it on Google Play"
          width={160}
          height={53}
          className="hidden h-11 w-auto dark:block"
        />
      </a>
    </div>
  );
}
