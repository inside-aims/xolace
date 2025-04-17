'use client';

import {MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SettingsWrapper from "@/components/settings/settings-wrapper";

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <SettingsWrapper>
      <div>
        <button
          className={"flex flex-row items-center p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"}
          onClick={() => router.back()}
        >
          <MoveLeft size={20}/>
        </button>
        <div className={"min-h-screen flex items-center justify-center"}>
          <h2 className={"text-xl  md:text-4xl  font-semibold"}>
            Future coming soon
          </h2>
        </div>
      </div>
    </SettingsWrapper>
  )
}