'use client';

import {ChevronRight, MoveLeft} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from "react";

export interface SettingsOptionProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  description: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

interface SettingsCardProps {
  overview?: string;
  name: string;
  options?: SettingsOptionProps[];
}

export function SettingsOptionCard(settingsOption: SettingsOptionProps) {
  const content = (
    <div className={"flex flex-row items-center gap-4 md:gap-8"}>
      {settingsOption.icon}
      <div className={"flex flex-col"}>
        <h5>{settingsOption.label}</h5>
        <p className={"text-neutral-400 text-sm"}>
          {settingsOption.description}
        </p>
      </div>
    </div>
  )

  return settingsOption?.disabled ? (
    <div
      className={"flex flex-row items-center justify-between px-8 text-neutral-500 cursor-not-allowed opacity-50"}
    >
      {content}
      <span><ChevronRight/></span>
    </div>
  ) : (
    <Link
      href={settingsOption.route}
      className={"px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"}
    >
      <div className={"flex flex-row items-center justify-between px-0 md:px-4"}>
        {content}
        <span><ChevronRight/></span>
      </div>
    </Link>
  )
}

export function SettingsCard(props: SettingsCardProps) {
  const router = useRouter();
  return (
    <div className={"flex w-full flex-col gap-4 leading-normal"}>
      <div className={"flex flex-row gap-8 font-semibold text-xl py-2 px-4"}>
        <button
          className={"flex items-center justify-center md:hidden rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"}
          onClick={() => router.back()}
        >
          <MoveLeft size={20}/>
        </button>
        <span>
          {props.name}
        </span>
      </div>
      <div className={"text-neutral-400 px-4"}>
        {props.overview}
      </div>
      <div className={"flex w-full flex-col gap-4"}>
        {
          props.options?.map(option => (
            <SettingsOptionCard
              key={option.route}
              {...option}
            />
          ))
        }
      </div>
    </div>
  )
}