'use client';

import {MoveLeft} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export interface AccountInfoDetailsProps {
  key: string,
  label: string,
  icon?: React.ReactNode,
  response?: string,
  href: string,
  disabled?: boolean
}

/*
# Settings sub-options navigation component
# Takes props title(optional) and children.
# To enhance easy navigation both mobile and desktop
 */
export function SettingsNavigationWrapper({title, children}: {
  title?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="w-full flex items-start flex-col gap-4">
      {/*Back navigation*/}
      <div className={"flex items-center flex-row gap-14 py-2 px-4"}>
        <button
          className={"rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"}
          onClick={() => router.back()}
        >
          <MoveLeft size={20}/>
        </button>
        <span className={"text-lg font-semibold"}>{title}</span>
      </div>
      <div className={"flex w-full items-start flex-col"}>
        {children}
      </div>
    </div>
  )
}


/*
# Settings sub-options account information card component
# Takes props label, icon, response, href, disabled(default false).
# For easy code maintainable
 */
export function AccountInformationCard (
  {label, icon, response, href, disabled = false}: AccountInfoDetailsProps ) {
  const commonClasses = "w-full flex px-4 py-2 rounded transition-colors";
  const content = (
    <div className="w-full flex flex-row items-center justify-between px-4">
      <div className="flex flex-col">
        <h5>{label}</h5>
        <p className="text-neutral-400 text-sm">{response}</p>
      </div>
      {icon}
    </div>
  );

  return disabled ? (
    <div
      className={`${commonClasses} text-neutral-500 cursor-not-allowed opacity-50`}
    >
      {content}
    </div>
  ) : (
    <Link
      href={href}
      className={`${commonClasses} hover:bg-neutral-100 dark:hover:bg-neutral-900`}
    >
      {content}
    </Link>
  );
}