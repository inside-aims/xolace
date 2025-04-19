"use client"

// import type { Metadata } from 'next'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Archive, Power,} from 'lucide-react';
import {SettingsCard, SettingsOptionProps} from "@/components/settings/settings-card";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import { useMediaQuery } from '@/hooks/use-media-query';
/*
We will find a way to get metadata for settings 😵‍💫
*/
// export const metadata: Metadata = {
//   title: 'Settings',
// }


export default function SettingsPage() {
const isDesktop = useMediaQuery('(min-width: 768px)');
    const router = useRouter()

    // on desktop view navigate to "/settings/your-account" when settings route is hit
    useEffect(() => {
        if (isDesktop) {
            router.replace('/settings/your-account')
        }
    }, [isDesktop, router])

  
  return (
    <>
      <div className="w-full flex items-start flex-col">
        <SettingsWrapper page="settings"/>
      </div>
    </>
  )
}