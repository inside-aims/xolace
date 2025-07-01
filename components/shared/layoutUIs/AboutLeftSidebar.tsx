"use client"

import React from 'react'
import { aboutLeftSideLinks } from '@/utils';
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AboutSidebarLinkInterface{
    imgURL: React.JSX.Element,
    route: string;
    label: string;
  }

const AboutLeftSidebar = () => {
    const router = useRouter();
    const pathName = usePathname();
  return (
    <section className='hidden md:min-w-28 lg:min-w-72 md:block h-screen overflow-auto'>
        <div className='relative flex items-center gap-x-10 p-5'>
        <div
          className=" hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </div>
        <p className=' text-2xl font-bold max-lg:hidden'>About</p>
        </div>

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
                replace
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