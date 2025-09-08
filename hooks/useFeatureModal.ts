// hooks/useFeatureModal.ts

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FeatureModalManager, FeatureModalConfig } from '@/utils/helpers/featureModalStorageHelper';

interface UseFeatureModalOptions {
  config: FeatureModalConfig;
  delay?: number; // Delay in milliseconds before showing modal
  autoShow?: boolean; // Whether to auto-show on mount
}

export const useFeatureModal = ({ 
  config, 
  delay = 1000, 
  autoShow = true 
}: UseFeatureModalOptions) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Check if modal should be shown
  const shouldShow = FeatureModalManager.shouldShowModal(pathname);

  useEffect(() => {
    // Mark as ready after component mount (avoid hydration issues)
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !autoShow || !shouldShow) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isReady, autoShow, shouldShow, delay]);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const dismissModal = () => {
    FeatureModalManager.dismissModal(pathname);
    setIsOpen(false);
  };

  const dismissAllModals = () => {
    FeatureModalManager.dismissAllModals();
    setIsOpen(false);
  };

  return {
    isOpen,
    showModal,
    hideModal,
    dismissModal,
    dismissAllModals,
    shouldShow,
  };
};