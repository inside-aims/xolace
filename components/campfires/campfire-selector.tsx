import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Users, ChevronDown } from "lucide-react";
import { CampfirePurpose } from "./campfires.types";
import { DefaultLoader } from "../shared/loaders/DefaultLoader";

export interface UserCampfire {
    campfireId: string;
    name: string;
    slug: string;
    description: string;
    iconURL?: string;
    purpose: CampfirePurpose;
    role: 'admin' | 'moderator' | 'camper';
    memberCount: number;
  }

interface CampfireSelectorProps {
    selectedCampfire: UserCampfire | null;
    setSelectedCampfire: React.Dispatch<React.SetStateAction<UserCampfire | null>>;
    showCampfireSelector: boolean;
    setShowCampfireSelector: React.Dispatch<React.SetStateAction<boolean>>;
    userCampfires: UserCampfire[];
    loadingCampfires: boolean;
}


export const CampfireSelector = ({
    selectedCampfire,
    setSelectedCampfire,
    showCampfireSelector,
    setShowCampfireSelector,
    userCampfires,
    loadingCampfires,
}: CampfireSelectorProps) => (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowCampfireSelector(!showCampfireSelector)}
        className={`h-12 justify-start rounded-xl px-4 transition-all duration-200 ${
          selectedCampfire 
            ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950' 
            : 'border-border'
        }`}
      >
        <div className="flex items-center gap-3 w-full">
          {selectedCampfire ? (
            <>
              {selectedCampfire.iconURL ? (
                <img 
                  src={selectedCampfire.iconURL} 
                  alt={selectedCampfire.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{selectedCampfire.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedCampfire.memberCount.toLocaleString()} members
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center">
                <Home className="h-3 w-3" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Your Profile</div>
                <div className="text-xs text-muted-foreground">Post to your timeline</div>
              </div>
            </>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </Button>
  
      {showCampfireSelector && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-bg dark:bg-bg-dark border border-border rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {/* Your Profile Option */}
          <button
            type="button"
            onClick={() => {
              setSelectedCampfire(null);
              setShowCampfireSelector(false);
            }}
            className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border ${
              !selectedCampfire ? 'bg-purple-50 dark:bg-purple-950/50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">Your Profile</div>
                <div className="text-xs text-muted-foreground">Post to your timeline</div>
              </div>
            </div>
          </button>
  
          {/* Loading State */}
          {loadingCampfires && (
            <div className="p-4 text-center text-muted-foreground">
              <DefaultLoader size={20} />
            </div>
          )}
  
          {/* Campfires List */}
          {userCampfires.map(campfire => (
            <button
              key={campfire.campfireId}
              type="button"
              onClick={() => {
                setSelectedCampfire(campfire);
                setShowCampfireSelector(false);
              }}
              className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                selectedCampfire?.campfireId === campfire.campfireId 
                  ? 'bg-purple-50 dark:bg-purple-950/50' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {campfire.iconURL ? (
                  <img 
                    src={campfire.iconURL} 
                    alt={campfire.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">{campfire.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {campfire.memberCount.toLocaleString()} members • {campfire.role}
                  </div>
                </div>
              </div>
            </button>
          ))}
  
          {/* Empty State */}
          {!loadingCampfires && userCampfires.length === 0 && (
            <div className="p-6 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm font-medium text-muted-foreground">No campfires joined</div>
              <div className="text-xs text-muted-foreground">Join some campfires to post in them</div>
            </div>
          )}
        </div>
      )}
    </div>
  );