'use client';

import SettingsWrapper from '@/components/settings/settings-wrapper';
import { SettingsNavigationWrapper } from '@/components/settings/settings-navigation';
import { Switch } from '@/components/ui/switch';
import {
  usePreferencesStore,
  UserPreferences,
} from '@/lib/store/preferences-store';

interface PreferenceOptionsInterface {
  key: keyof Omit<
    UserPreferences,
    | 'id'
    | 'user_id'
    | 'created_at'
    | 'updated_at'
    | 'theme'
    | 'preferred_language'
    | 'privacy'
    | 'show_sensitive_content'
    | 'mark_sensitive_by_default'
  >; // Use specific keys
  label: string;
  description: string;
}

//Customize experience option for user - Map keys to store keys
const customizeExperienceOptions: PreferenceOptionsInterface[] = [
  {
    key: 'guided_tour_enabled',
    label: 'Guided Tour',
    description:
      'Enable a guided tour to help you understand how things work on the platform',
  },
  {
    key: 'auto_save_drafts',
    label: 'Save Drafts Automatically',
    description: "We'll save your thoughts while you type just in case.",
  },
  {
    key: 'daily_prompt_enabled',
    label: 'Daily Prompt',
    description: 'A quiet nudge each day to help you express yourself.',
  },
  {
    key: 'allow_anonymous_replies',
    label: 'Let People Reply Anonymously',
    description:
      "Responses won’t show who they're from, keeping the space safe.",
  },
];

export default function PreferencesPage() {
  return (
    <>
      <div className="flex w-full flex-col items-start md:hidden">
        <PreferencesContent />
      </div>
      <div className="hidden flex-col items-center md:flex">
        <SettingsWrapper>
          <PreferencesContent />
        </SettingsWrapper>
      </div>
    </>
  );
}

function PreferencesContent() {
  // Get state and actions from the store
  const { preferences, updatePreference, isLoading, error } =
    usePreferencesStore();

  // Handle toggle using the store's update function
  const handleTogglePreference = (
    optionKey: keyof Omit<
      UserPreferences,
      | 'id'
      | 'user_id'
      | 'created_at'
      | 'updated_at'
      | 'theme'
      | 'preferred_language'
      | 'privacy'
      | 'show_sensitive_content'
      | 'mark_sensitive_by_default'
    >,
    newValue: boolean,
  ) => {
    updatePreference(optionKey, newValue);
  };

  if (isLoading && !preferences) {
    return (
      <SettingsNavigationWrapper title={'Preferences'}>
        <div className="p-4">Loading preferences...</div>
      </SettingsNavigationWrapper>
    );
  }

  if (error) {
    return (
      <SettingsNavigationWrapper title={'Preferences'}>
        <div className="p-4 text-red-500">
          Error loading preferences: {error}
        </div>
      </SettingsNavigationWrapper>
    );
  }

  return (
    <SettingsNavigationWrapper title={'Preferences'}>
      <div className={'flex w-full flex-col items-start gap-4 px-4'}>
        <div className={'leading-normal'}>
          <h4 className={'text-xl font-semibold'}>Customise your experience</h4>
          <p className={'w-full text-sm text-neutral-400 md:w-[80%]'}>
            Choose how you want to experience the platform. Everything here is
            built to keep you safe, anonymous, and in control.
          </p>
        </div>
        {/*possible customize experience*/}
        <div className={'flex w-full flex-col items-start gap-4'}>
          {customizeExperienceOptions.map(item => {
            const currentState = preferences ? preferences[item.key] : false;
            return (
              <div
                className={'flex w-full flex-col items-start'}
                key={item.key}
              >
                <h4 className={'flex w-full items-center justify-between'}>
                  {item.label}
                  <span className={'ml-auto justify-end'}>
                    <Switch
                      checked={currentState}
                      onCheckedChange={checked =>
                        handleTogglePreference(item.key, checked)
                      }
                      disabled={isLoading} // Disable switch while updating
                    />
                  </span>
                </h4>
                <p className={'text-sm text-neutral-500'}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SettingsNavigationWrapper>
  );
}
