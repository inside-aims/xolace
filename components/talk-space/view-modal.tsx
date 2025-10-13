'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";

interface ViewModalProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}

const ViewModal = (
  {
    drawerOpen,
    setDrawerOpen,
    children,
    title,
  }: ViewModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="items-center">
      {isDesktop ? (
        <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DialogContent className="w-full max-w-[600px] border-0 rounded-2xl p-0 max-h-[60vh] overflow-hidden [&>button]:hidden">
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
                <DialogTitle className="text-lg font-semibold">
                  {title}
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <X className="h-5 w-5"/>
                  </Button>
                </DialogClose>
              </div>
            )}
            <div className="overflow-y-auto px-6 py-4 max-h-[50vh]">
              {children}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild></DrawerTrigger>
          <DrawerContent className="bg-bg dark:bg-bg-dark">
            {title && (
              <DrawerHeader className="pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <DrawerTitle className="text-center">{title}</DrawerTitle>
                <DrawerDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400"/>
              </DrawerHeader>
            )}
            <div className="px-4 pb-2 overflow-y-auto max-h-[50vh]"> {children} </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default ViewModal;
