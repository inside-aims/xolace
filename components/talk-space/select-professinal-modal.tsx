import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import {useMediaQuery} from "@/hooks/use-media-query";
import {ActionButton} from "@/components/talk-space/quick-actions";

interface GuidePreviewProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const SelectProfessionalModal = (
  {  drawerOpen,
    setDrawerOpen,
  }: GuidePreviewProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="items-center">
      {isDesktop ? (
        <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DialogContent className="w-full max-w-[500px] border-0 rounded-2xl!">
            <DialogHeader>
              <DialogTitle className="flex items-center" >
                Select a conversation
              </DialogTitle>
            </DialogHeader>
           <ActionButton/>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
          </DrawerTrigger>
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-center" />
            <DrawerDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400" />
          </DrawerHeader>
          <DrawerContent className="max-h-[90vh] bg-bg dark:bg-bg-dark px-8 pb-8">
            <ActionButton/>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default SelectProfessionalModal;
