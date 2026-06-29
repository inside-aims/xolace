"use client";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import type React from "react";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import {XolaceLogo} from "@/components/shared/layoutUIs/xolace-logo";
import {DownloadButtons} from "@/components/shared/layoutUIs/download-buttons";

const footerColumns = [
  {
    title: "About",
    links: ["Our Story", "Mental Health", "Privacy Promise"],
  },
  {
    title: "Resources",
    links: ["Help Center", "FAQ", "Blog"],
  },
  {
    title: "Download",
    links: ["App Store", "Google Play"],
  },
  {
    title: "Legal",
    links: ["About Us", "Terms & Conditions", "Privacy Policy"],
  },
];

const socialPlatforms: { name: string; url: string; icon: React.ReactNode }[] =
  [
    {
      name: "WhatsApp",
      url: "",
      icon: <IconBrandWhatsapp />,
    },
    {
      name: "Instagram",
      url: "",
      icon: <IconBrandInstagram />,
    },
    {
      name: "Facebook",
      url: "",
      icon: <IconBrandFacebook />,
    },
    {
      name: "LinkedIn",
      url: "",
      icon: <IconBrandLinkedin />,
    },
  ];

export function CurrentYear() {
  return <span>{new Date().getFullYear()}</span>;
}

export const FooterSection = () => {
  return (
    <footer id={"footer"} className="relative w-full">
      {/* CTA Card */}
      <div className="relative z-40 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto -mb-32">
        <div className="bg-linear-to-br from-accent via-accent/90 to-accent/80 rounded-3xl shadow-2xl p-8 md:p-16 border">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <p className="text-sm md:text-base text-foreground">
              Available on iOS &amp; Android
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
              A quiet place to be human.
            </h2>
            <DownloadButtons />
            <p className="text-sm text-foreground/60">
              Or{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                continue to the web app
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full pt-48 pb-4 bg-muted dark:bg-card px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label="Xolace home">
              <XolaceLogo size="sm" />
            </Link>
            <p className="text-sm text-foreground/70 mt-2 flex gap-1">
              <span>&copy;</span>
              <Suspense fallback={<span>—</span>}>
                <CurrentYear />
              </Suspense>
              <span>All rights reserved.</span>
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-bold text-base mb-2">{col.title}</h3>
              {col.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors mb-2"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-muted-foreground" />

        {/* Bottom Bar */}
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <p className="px-4 py-2 text-sm rounded-md border border-foreground/50">
              EN
            </p>
          </div>

          <div className="flex gap-4">
            {socialPlatforms.map((platform) => (
              <Link key={platform.name} href={platform.url}>
                {platform.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
