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
import GuidePreview from "@/components/mods/features/guide/guide-preview";
import React from "react";
import {useMediaQuery} from "@/hooks/use-media-query";

interface GuidePreviewProps {
  campfireName: string;
  welcomeMsg: string;
  resource?: { label: string; value: string }[];
  icon: string | null;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CampfireGuideModal = (
  { welcomeMsg,
    campfireName,
    resource, drawerOpen,
    setDrawerOpen,
    icon
  }: GuidePreviewProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="items-center">
      {isDesktop ? (
        <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DialogContent className="w-full max-w-[400px] border-0 rounded-2xl!">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-1" />
            </DialogHeader>
            <GuidePreview
              welcomeMsg={welcomeMsg}
              campfireName={campfireName}
              resource={resource}
              icon={icon}
              modTitle={campfireName}
            />
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
          <DrawerContent className="max-h-[85vh] bg-bg dark:bg-bg-dark px-8 pb-8">
            <GuidePreview
              welcomeMsg={welcomeMsg}
              campfireName={campfireName}
              resource={resource}
              icon={icon}
              modTitle={campfireName}
            />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default CampfireGuideModal;
