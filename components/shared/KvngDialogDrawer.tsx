import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../ui/button';

interface KvngDialogDrawerProps {
  isDialogDrawerOpen: boolean;
  setIsDialogDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  title?: string;
}

const KvngDialogDrawer = ({
  isDialogDrawerOpen,
  setIsDialogDrawerOpen,
  children,
  title,
}: KvngDialogDrawerProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {isDesktop ? (
        <Dialog open={isDialogDrawerOpen} onOpenChange={setIsDialogDrawerOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{title || 'Report'}</DialogTitle>
              <DialogDescription>
                What area are you having problems with?
              </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDialogDrawerOpen} onOpenChange={setIsDialogDrawerOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Report</DrawerTitle>
              <DrawerDescription>
                What area are you having problems with?
              </DrawerDescription>
            </DrawerHeader>
            {children}
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default KvngDialogDrawer;
