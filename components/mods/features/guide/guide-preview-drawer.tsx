// components/mods/features/guide/guide-preview-drawer.tsx
'use client';

import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';
import GuidePreview from '@/components/mods/features/guide/guide-preview';

interface GuidePreviewDrawerProps {
  welcomeMsg: string;
  campfireName: string;
  resources: { label: string; value: string }[];
  icon: string | null;
}

const GuidePreviewDrawer: React.FC<GuidePreviewDrawerProps> = ({
  welcomeMsg,
  campfireName,
  resources,
  icon
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full rounded-lg border-dashed border-2 border-lavender-300 hover:border-lavender-400 hover:bg-lavender-50 dark:hover:bg-lavender-950 text-lavender-600 dark:text-lavender-400"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Guide
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] bg-bg dark:bg-bg-dark">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-center">Guide Preview</DrawerTitle>
          <DrawerDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            This is how your campfire guide will appear to users
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 overflow-y-auto flex-1">
          <div className="max-w-sm mx-auto">
            <GuidePreview
              welcomeMsg={welcomeMsg}
              campfireName={campfireName}
              resource={resources}
              icon={icon}
            />
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-lg">
              <X className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default GuidePreviewDrawer;