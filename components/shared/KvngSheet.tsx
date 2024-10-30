import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import FeedbackForm from "../forms/FeedbackForm";
import { BellRing } from "lucide-react";

interface KvngSheetProps {
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}
export function KvngSheet({ open, onOpenChange }: KvngSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-x-2">Send us a Feedback <BellRing /> </Button>
      </SheetTrigger>
      <SheetContent className=" z-50">
        <SheetHeader>
          <SheetTitle>Feedback</SheetTitle>
          <SheetDescription>
            Provide your valuable feedback to the team
          </SheetDescription>
        </SheetHeader>
        <FeedbackForm />
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Submit</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
