"use client"

import { ChevronRight, Key, GlobeLock, Copyright, Eclipse } from 'lucide-react'
import React from 'react';

import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

const Icons = {
  chevronRight: ChevronRight,
  Key,
  GlobeLock,
  Copyright,
  Eclipse
  // Add more icons as needed
} as const;

type IconKeys = keyof typeof Icons;

interface NativeItemsProps {
  items: {
    icon: IconKeys;
    label: string;
    badge?: string;
    href: string;
  }[]
}

export function NativeItems({ items }: NativeItemsProps) {
  return (
    <div>
      {items.map((item, index) => {
        const Icon = Icons[item.icon] 
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex w-full items-center justify-between px-4 py-3 text-white  relative"
          >
            <div className="flex items-center gap-3 z-10">
              <Icon className="h-6 w-6 text-zinc-400" />
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <Badge variant="secondary" className="bg-zinc-700">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </div>
            {index !== items.length - 1 && (
              <div className="absolute bottom-0 left-14 right-4 h-px bg-zinc-800" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
