'use client';

import type React from 'react';
import { TourProvider as ReactourProvider } from '@reactour/tour';
import { TourButton, TourNavigation, TourProgress } from '@/styles/tourStyles';

interface TourProviderProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: any[];
}

export default function TourProvider({ children, steps }: TourProviderProps) {
  return (
    <ReactourProvider
      steps={steps}
      styles={{
        popover: base => ({
          ...base,
          background: 'none',
          padding: 0,
          boxShadow: 'none',
        }),
      }}
      components={{
        Badge: () => null,
        Navigation: ({ currentStep, steps, setCurrentStep, setIsOpen }) => (
          <TourNavigation>
            <TourButton
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </TourButton>
            <TourProgress>
              {currentStep + 1} / {steps.length}
            </TourProgress>
            {currentStep === steps.length - 1 ? (
              <TourButton onClick={() => setIsOpen(false)}>Finish</TourButton>
            ) : (
              <TourButton onClick={() => setCurrentStep(s => s + 1)}>
                Next
              </TourButton>
            )}
          </TourNavigation>
        ),
      }}
    >
      {children}
    </ReactourProvider>
  );
}
