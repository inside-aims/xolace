'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitch from '../../ui/ThemeSwitch';
import {sidebarLinks} from "@/constants";

function Bottombar() {
  const pathName = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(link => {
          const isActive: boolean =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && 'bg-primary-500'} ${link.route === '/profile' && 'max-md:hidden'} ${link.route === '/channel' && 'max-md:hidden'} ${link.route === '/explore' && 'max-md:hidden'} ${link.route === '/collections' && 'max-md:hidden'} ${link.route === 'https://messaging.xolace.app/dashboard' && 'max-md:hidden'} `}
            >
              {link.icon}
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
        <div id="theme-btn">

        <ThemeSwitch />
        </div>
      </div>
    </section>
  );
}

export default Bottombar;
