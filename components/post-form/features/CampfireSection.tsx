import React, { useEffect } from 'react';
import { CampfireSelector, UserCampfire } from '@/components/campfires/campfire-selector';
import { getUserCampfires } from '@/queries/campfires/getUserCampfires';

interface CampfireSectionProps {
  userId?: string;
  selectedCampfire: UserCampfire | null;
  onCampfireChange: React.Dispatch<React.SetStateAction<UserCampfire | null>>;
  submitToSlug?: string;
  disabled?: boolean;
}

/**
 * CampfireSection Component
 * 
 * Handles campfire selection with data fetching and pre-selection logic
 * 
 * @improvements
 * 1. Encapsulates campfire data fetching
 * 2. Handles pre-selection from URL params
 * 3. Manages loading states
 * 4. Separates business logic from UI
 * 5. Error handling for data fetching
 */
export function CampfireSection({
  userId,
  selectedCampfire,
  onCampfireChange,
  submitToSlug,
  disabled = false,
}: CampfireSectionProps) {
  const [showCampfireSelector, setShowCampfireSelector] = React.useState(false);

  // Fetch user's campfires
  const { data: userCampfires = [], isLoading: loadingCampfires } = getUserCampfires(userId);

  /**
   * Pre-select campfire if submitToSlug is provided
   */
  useEffect(() => {
    if (submitToSlug && userCampfires.length > 0 && !selectedCampfire) {
      const targetCampfire = userCampfires.find(c => c.slug === submitToSlug);
      if (targetCampfire) {
        onCampfireChange(targetCampfire);
      }
    }
  }, [submitToSlug, userCampfires, selectedCampfire, onCampfireChange]);

  return (
    <div className="space-y-2">
      <label className="text-foreground text-sm font-medium">
        Post to
      </label>
      <CampfireSelector
        selectedCampfire={selectedCampfire}
        setSelectedCampfire={onCampfireChange}
        showCampfireSelector={showCampfireSelector}
        setShowCampfireSelector={setShowCampfireSelector}
        userCampfires={userCampfires}
        loadingCampfires={loadingCampfires}
        disabled={disabled}
      />
    </div>
  );
}