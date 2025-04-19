'use client';

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import {Input} from "@/components/ui/input";
import {useState} from "react";

// Settings categorization(options) with subOptions
const settingsOption: {link: string, key: string, name: string, disabled?: boolean}[] = [
  { link: "/settings/your-account", key: "yourAccount", name: "Your Account" },
  { link: "/settings/notifications", key: "notifications", name: "Notifications", disabled: true },
  { link: "/settings/privacy-safety", key: "privacySafety", name: "Privacy & Safety" },
  { link: "/settings/security-access", key: "securityAccess", name: "Security Access" },
  { link: "/settings/help-center", key: "help-center", name: "Help Center" },
];

export default function SettingsWrapper({ children, page }: { children?: React.ReactNode, page?: "settings" }) {
  const [ searchTerm, setSearchTerm ] = useState<string>('');

  const pathname = usePathname();

  const filteredOptions = searchTerm.trim() ?
    settingsOption.filter(
      option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : settingsOption;

  return (
    <>
      <div className="w-full items-start grid grid-cols-12 min-h-screen">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-4">
          <div className={"w-full flex flex-col items-start py-2 px-4 gap-4 mb-4"}>
            <h4 className={"text-lg md:text-xl font-semibold"}>Settings</h4>
            <div className="relative w-full">
              <span className="absolute inset-y-0 start-0 flex items-center ps-4">
                <Search className="w-4 h-4 text-muted-foreground"/>
              </span>
              <Input
                type="text"
                name="searchInput"
                placeholder="Search settings"
                className="rounded-full py-4 ps-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredOptions.map((option) => {
            const currentSection = pathname.split("/")[2] || "";
            const optionSection = option.link.split("/")[2] || "";

            let isActive = false;

            if (option.link === "/settings") {
              isActive = pathname === "/settings" || currentSection === "your-account";
            } else {
              isActive = currentSection === optionSection;
            }
            return (
              <Link key={option.key} href={option.link}
                    className={`${option.disabled ? "text-neutral-500 cursor-not-allowed opacity-50" : ""}`}>
                <div
                  className={`p-4 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                    isActive
                      ? 'md:bg-neutral-200 md:dark:bg-neutral-900 md:border-e-2 md:border-neutral-400'
                      : ''
                  }`}
                >
                  {option.name}
                  <span className="justify-end"> <ChevronRight/> </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className={`col-span-12 md:col-span-8 border border-y-0 border-e-0 min-h-full ${page&&"hidden"}`}>
          { children }
        </div>
      </div>
    </>
  );
}
