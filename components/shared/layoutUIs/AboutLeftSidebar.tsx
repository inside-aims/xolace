"use client"

import React from 'react'
import { aboutLeftSideLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AboutSidebarLinkInterface{
    imgURL: React.JSX.Element,
    route: string;
    label: string;
  }

const AboutLeftSidebar = () => {
    const pathName = usePathname();
  return (
    <section className='hidden md:min-w-28 lg:min-w-72 md:block h-screen overflow-auto'>
        <p className=' text-2xl font-bold p-5'>About</p>

        <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {aboutLeftSideLinks.map((link: AboutSidebarLinkInterface) => {
            const isActive =
              (pathName.includes(link.route) && link.route.length > 1) ||
              pathName == link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${isActive && 'bg-primary-500'} hover:bg-primary-500`}
              >
                {link.imgURL}
                <p className="text-dark-2 dark:text-light-1 max-lg:hidden">
                  {link.label}
                </p>
              </Link>
            );
          })}
        </div>
    </section>
  )
}

export default AboutLeftSidebar