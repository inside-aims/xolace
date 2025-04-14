'use client';

import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import Link from "next/link";
import {ChevronRight} from "lucide-react";

const securityContentOption: {label: string, key: string, href: string, description: string}[] = [
  {
    label: "Two-factor authentication",
    key: 'twoFactorAuthentication',
    href: "/settings/security-access/two-factor-authentication",
    description: "Help protect your account from unauthorized access by requiring a second authentication method in addition to your Xolace password. You can choose a text message, authentication app, or security key."
  },
  // {
  //   label: "ID Verification",
  //   key: 'idVerification',
  //   href: "/settings/security-access/id-verification",
  //   description: "Upload an approved form of identification to confirm the authenticity of your account. Your information will only be used to validate your identity and will be handled safely and securely."
  // }

]
export default function SecurityPage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <SecurityContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <SecurityContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function SecurityContent() {

  return (
    <SettingsNavigationWrapper title="Security">
      <div className={"w-full flex flex-col items-start gap-4"}>
        <p className={"w-full text-neutral-400 px-4"}>
          {`Decide what you see on Xolace, based on your preferences like Topic and interests`}
        </p>
        {
          securityContentOption.map((item) => (
            <div className={"w-full flex flex-col items-start gap-2"} key={item.key}>
              <h4 className={" px-4 w-full flex items-center font-semibold text-lg"}>
                {item.label}
              </h4>
              <div className={"flex flex-col w-full"}>
                <Link
                  href={item.href}
                  className={"py-4 w-full flex hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
                  <p className={" px-4 w-full flex items-center justify-between text-lg"}>
                    {item.label}
                    <span className={"justify-end ml-auto"}>
                      <ChevronRight/>
                    </span>
                  </p>
                </Link>
                <p className={" px-4 text-neutral-400 text-sm"}>
                  {item.description}
                  <span className={"text-blue9 hover:underline"}>Learn more</span>
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </SettingsNavigationWrapper>
  );
}
