import React from 'react';
import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

interface PostFormFooterProps {
  tipText?: string;
  links?: FooterLink[];
  copyrightText?: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { href: '/policies', label: 'Xolace Rules' },
  { href: '/policies', label: 'Privacy Policy' },
  { href: '/policies', label: 'User Agreement' },
];

/**
 * PostFormFooter Component
 * 
 * Footer section with tip, links, and copyright
 * 
 * @improvements
 * 1. Extracted footer UI
 * 2. Configurable links
 * 3. Responsive layout
 * 4. Accessible navigation
 */
export function PostFormFooter({
  tipText = 'Tip : Platform made to share your experiences without holding back..',
  links = DEFAULT_LINKS,
  copyrightText = 'Xolace, Inc. © 2025. All rights reserved.',
}: PostFormFooterProps) {
  return (
    <div className="flex h-full flex-col gap-y-20 md:gap-y-30 lg:gap-y-36">
      {/* Tip Section */}
      {tipText && (
        <div className="">
          <div className="container mx-auto px-3 pt-10 text-center text-sm text-zinc-600 md:pt-20">
            {tipText}
          </div>
        </div>
      )}

      {/* Links Section */}
      <section className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2 px-2 pb-4 text-xs text-slate-600/60 dark:text-slate-400/60">
          {links.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && index < links.length && (
                <span className="metadata-divider before:content-['•']" aria-hidden="true"></span>
              )}
              <span>
                <Link
                  className="hover:text-slate-200 hover:underline"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </span>
            </React.Fragment>
          ))}
          {copyrightText && (
            <>
              <span className="metadata-divider before:content-['•']" aria-hidden="true"></span>
              <span>
                <Link className="hover:text-slate-200 hover:underline" href="#">
                  {copyrightText}
                </Link>
              </span>
            </>
          )}
        </div>
      </section>
    </div>
  );
}