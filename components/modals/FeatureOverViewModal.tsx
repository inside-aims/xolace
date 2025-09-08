// components/ui/FeatureOverviewModal.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureModalConfig } from '@/utils/helpers/featureModalStorageHelper';

interface FeatureOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FeatureModalConfig;
  onDismissForever?: () => void;
}

export const FeatureOverviewModal: React.FC<FeatureOverviewModalProps> = ({
  isOpen,
  onClose,
  config,
  onDismissForever,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleNextStep = () => {
    if (currentStep < config.features.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setShowDetails(false);
    onClose();
  };

  const currentFeature = config.features[currentStep];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h2 className="text-xl font-bold">{config.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                {config.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Feature showcase */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-white">
                  {React.createElement(currentFeature.icon, { className: "h-5 w-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {currentFeature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentFeature.description}
                  </p>
                </div>
              </div>

              {/* Progress indicators */}
              {config.features.length > 1 && (
                <div className="flex justify-center gap-2 py-2">
                  {config.features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-6'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Show more details toggle */}
            {config.features.length > 1 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mt-4"
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDetails ? 'Hide all features' : 'See all features'}
              </button>
            )}

            {/* All features preview */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 max-h-40 overflow-y-auto">
                    {config.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                          index === currentStep
                            ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <div className={`p-1.5 rounded-md ${
                          index === currentStep 
                            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {React.createElement(feature.icon, { className: "h-3 w-3" })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {feature.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {/* Navigation */}
              {config.features.length > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextStep}
                    disabled={currentStep === config.features.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                {/* Don't show again */}
                {onDismissForever && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onDismissForever();
                      handleClose();
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Don't show again
                  </Button>
                )}
                
                {/* Got it */}
                <Button
                  onClick={handleClose}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};