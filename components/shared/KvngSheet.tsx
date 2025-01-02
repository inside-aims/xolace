import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BellRing } from "lucide-react";

interface KvngSheetProps {
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger?: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
}
export function KvngSheet({
  open,
  onOpenChange,
  trigger = true,
  title,
  description,
  children,
}: KvngSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-x-2">
            Send us a Feedback <BellRing />{" "}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className=" z-50">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
