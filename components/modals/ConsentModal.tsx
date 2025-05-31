import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { CURRENT_CONSENT_VERSION } from "@/constants/terms";
import type { Profile } from "@/types/global";
import { useUserState } from "@/lib/store/user";
import { Info } from "lucide-react";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept?: () => void;
  onReject: () => void;
  user: Profile;
}

const consentItems = [
  {
    id: "respectful",
    text: "I agree to keep my posts respectful and free from hate speech, harassment, or bullying"
  },
  {
    id: "truthful",
    text: "I will not share false information, misinformation, or deliberately misleading content"
  },
  {
    id: "privacy",
    text: "I will respect others' privacy and not share personal information without consent"
  },
  {
    id: "copyright",
    text: "I will not post copyrighted content that I don't have permission to share"
  },
  {
    id: "guidelines",
    text: "Misuse of post creation may result in your account being suspended or banned"
  }
];

const ConsentModal = ({ isOpen, onReject , user}: ConsentModalProps) => {
    const supabase = getSupabaseBrowserClient()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    const allItemsChecked = consentItems.every(item => checkedItems[item.id]);
    setAllChecked(allItemsChecked);
  }, [checkedItems]);

  const handleCheckChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleAccept = async () => {
    if (allChecked) {
      const { error: updateError } = await supabase
      .from('profiles')
      .update({
        has_consented : true,
        consent_version : CURRENT_CONSENT_VERSION
      })
      .eq('id', user.id)
      .select()
      .single();

      if (updateError) {
        console.log(updateError)
        toast.error('Oops🫢!! Consent could not be accepted.');
        return;
      }

      useUserState.setState({ user: { ...user, has_consented : true, consent_version : CURRENT_CONSENT_VERSION } });

      // Reset the form for next time
      setCheckedItems({});
      onReject()
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onReject()}>
      <DialogContent className=" max-w-[95%] md:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative">
          {/* Hero Image */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-600 relative overflow-hidden">
            <Image
              src="/assets/images/AIMS.png"
              alt="Community guidelines"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Community Guidelines</h2>
              <p className="text-white/90">Help us maintain a safe and welcoming environment</p>
            </div>
          </div>

          {/* Content */}
          <div className=" px-1 py-6 lg:p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl text-gray-800 dark:text-white">
                Before you post, please agree to our guidelines
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mb-6">
              {consentItems.map((item) => (
                <Card key={item.id} className="p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(checked) => handleCheckChange(item.id, checked as boolean)}
                      className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm text-gray-700 dark:text-white leading-relaxed cursor-pointer"
                    >
                      {item.text}
                    </label>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-2 mb-4 flex items-center gap-2">
                <Info className=" w-6 h-6 md:w-4 md:h-4 text-honey-600" />
                <p className="text-[13px] text-gray-500">
                  The Dream and Goal of Xolace is to connect and share the worlds experiences in a safe and judgment-free zone.
                </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onReject}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!allChecked}
                className={`px-6 transition-all duration-200 ${
                  allChecked
                    ? "bg-ocean-600 text-white hover:bg-ocean-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;