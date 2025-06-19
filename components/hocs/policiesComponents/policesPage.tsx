'use client';

import React, { useState, useEffect } from 'react';
import { ReadingProgress } from '@/components/shared/reading-progress';
import { PolicyNavigation } from './policy-navigation';
import { BackgroundPattern } from './background-patterns';
import { policiesData } from '@/constants/polices-data';
import { MobileNavigation } from './mobile-navigation';
import { SearchOverlay } from './search-overlay';
import { PolicyContent } from './policy-content';
import { BackToTopButton } from '@/components/shared/back-to-top';

const PolicesPage = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activePolicy, setActivePolicy] = useState('community-guidelines');
  const [activeSection, setActiveSection] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -70% 0px' },
    );

    // Observe all section headings
    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [activePolicy]);

  const currentPolicy = policiesData.find(policy => policy.id === activePolicy);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-bg-dark dark:via-bg-dark/80 dark:to-bg-dark">
      <BackgroundPattern />

      {/* Reading Progress */}
      <ReadingProgress progress={readingProgress} />

      {/* Desktop Navigation */}
      <PolicyNavigation
        policies={policiesData}
        activePolicy={activePolicy}
        onPolicyChange={setActivePolicy}
        onSearchOpen={() => setIsSearchOpen(true)}
        className="hidden lg:block"
      />

      {/* Mobile Navigation */}
      <MobileNavigation
        policies={policiesData}
        activePolicy={activePolicy}
        onPolicyChange={setActivePolicy}
        onSearchOpen={() => setIsSearchOpen(true)}
        isOpen={isMobileNavOpen}
        onToggle={setIsMobileNavOpen}
        className="lg:hidden"
      />

      {/* Main Content */}
      <main className="min-h-screen lg:ml-80">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-12 lg:py-16">
          {currentPolicy && (
            <PolicyContent
              policy={currentPolicy}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          )}
        </div>
      </main>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        policies={policiesData}
        onPolicySelect={(policyId, sectionId) => {
          setActivePolicy(policyId);
          if (sectionId) {
            setTimeout(() => {
              const element = document.getElementById(sectionId);
              element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          setIsSearchOpen(false);
        }}
      />

      <BackToTopButton />
    </div>
  );
};

export default PolicesPage;
