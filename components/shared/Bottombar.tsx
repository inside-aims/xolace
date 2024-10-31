"use client";

import { sidebarLinks } from "@/constants";


import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "../ui/ThemeSwitch";

function Bottombar() {
  const pathName = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive: boolean =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;

          console.log(pathName);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"} ${link.route === "/profile" && "max-sm:hidden"} ${link.route === "/channel" && "max-sm:hidden"} `}
            >
              {link.imgURL}
              <p className=" text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
        <ThemeSwitch />
      </div>
    </section>
  );
}

export default Bottombar;
