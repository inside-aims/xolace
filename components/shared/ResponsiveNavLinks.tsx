import React, { PropsWithChildren } from "react";
import Link from "next/link";

interface NavLinkProps {
    active?: boolean;
    className?: string;
    href: string;
    onclick?: ()=> void;
  
}

const ResponsiveNavLink: React.FC<PropsWithChildren<NavLinkProps>> = ({
    active = false,
    className = "",
    children,
    href = "",
    onclick,
    ...props
  }) => {
    return (
      <Link
        {...props}
        href={href}
        onClick={onclick}
        className={` z-40 ${
          active ? "text-white dark:text-black " : "dark:text-black text-white"
        } text-base font-semibold uppercase relative group ${className}`}
      >
        {children}
        <span
          className={` inline-block absolute left-0 -bottom-0.5 dark:bg-black bg-white h-[1px] ${
            active ? "w-full" : "w-0"
          } group-hover:w-full transition-[width] ease duration-300 `}
        >
          &nbsp;
        </span>
      </Link>
    );
  }

  export default ResponsiveNavLink;