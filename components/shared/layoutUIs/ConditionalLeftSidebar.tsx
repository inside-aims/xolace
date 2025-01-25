"use client"

import { usePathname } from 'next/navigation';
import LeftSidebar from './LeftSideBar';

export default function ConditionalLeftSidebar() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/post/')) {
    return null;
  }

  return <LeftSidebar />;
}
