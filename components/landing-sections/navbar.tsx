"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {XolaceLogo} from "@/components/shared/layoutUIs/xolace-logo";
import {ModeToggle} from "@/components/shared/layoutUIs/theme-switcher";

const APP_STORE_URL = "https://apps.apple.com/gh/app/xolace/id6761601429";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#howItWorks",
    label: "Features",
  },
  {
    href: "#benefits",
    label: "Our Values",
  },
  {
    href: "#whyXolace",
    label: "Why Xolace",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="shadow-inner bg-opacity-15 w-full top-0 left-0 right-0 sticky border-b z-80 flex justify-between items-center py-3 px-4 md:px-8 bg-muted dark:bg-card">
      <Link href="/" aria-label="Xolace home">
        <XolaceLogo size="sm" priority />
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle>
                  <Link href="/" aria-label="Xolace home">
                    <XolaceLogo size="sm" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col px-4 max-h-[calc(100vh-6rem)] space-y-4">
                <Separator />
                {routeList.map(({ href, label }) => (
                  <div key={href} className="flex flex-col gap-4">
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      <Link href={href}>{label}</Link>
                    </Button>
                    <Separator />
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start gap-3">
              <Separator className="mb-2" />
              <Button asChild className="w-full font-semibold">
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  Get the App
                </Link>
              </Button>
              <ModeToggle />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem className={"w-full flex flex-row gap-4"}>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="px-2">
                  <p className={"text-base font-semibold"}>{label}</p>
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex items-center gap-3">
        <ModeToggle />
        <Button asChild size="sm" className="font-semibold">
          <Link href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            Get the App
          </Link>
        </Button>
      </div>
    </header>
  );
};
