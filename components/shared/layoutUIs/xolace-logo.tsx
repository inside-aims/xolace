import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: 40,
  md: 56,
  lg: 72,
  xl: 96,
};

interface XolaceLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}

export function XolaceLogo({
  size = "lg",
  className,
  priority = false,
}: XolaceLogoProps) {
  const px = sizes[size];
  return (
    <Image
      src="/logo/main-logo.png"
      alt="Xolace"
      height={px}
      width={px * 6}
      style={{ height: px, width: "auto" }}
      className={cn("object-contain", className)}
      priority={priority}
    />
  );
}
