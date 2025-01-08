import React, { PropsWithChildren } from 'react';
import Link from 'next/link';

interface NavLinkProps {
  active?: boolean;
  className?: string;
  href: string;
  onclick?: () => void;
}

const ResponsiveNavLink: React.FC<PropsWithChildren<NavLinkProps>> = ({
  active = false,
  className = '',
  children,
  href = '',
  onclick,
  ...props
}) => {
  return (
    <Link
      {...props}
      href={href}
      onClick={onclick}
      className={`z-40 ${
        active ? 'text-white dark:text-black' : 'text-white dark:text-black'
      } group relative text-base font-semibold uppercase ${className}`}
    >
      {children}
      <span
        className={`absolute -bottom-0.5 left-0 inline-block h-[1px] bg-white dark:bg-black ${
          active ? 'w-full' : 'w-0'
        } ease transition-[width] duration-300 group-hover:w-full`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

export default ResponsiveNavLink;
