"use client";

import Link from "next/link";

interface AuthRedirectProps {
  text?: string;
  linkText: string;
  href: string;
  nexturl?: string | null;
  className?: string;
  linkClassName?: string;
}

export const AuthRedirect = (
  {
    text,
    linkText,
    href,
    nexturl,
    className,
    linkClassName,
  }: AuthRedirectProps) => {
  const finalUrl = nexturl ? `${href}?nexturl=${nexturl}` : href;

  return (
    <p className={`text-sm text-center md:text-left ${className ?? ""}`}>
      {text && (
        <>{text}{" "}</>
      )}
      <Link
        href={finalUrl}
        className={linkClassName ?? "text-lavender-500 hover:text-lavender-600 font-medium hover:underline ml-1"}
      >
        {linkText}
      </Link>
    </p>
  );
};
