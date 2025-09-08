// utils/featureModal.ts

export interface FeatureModalConfig {
    route: string;
    storageKey: string;
    title: string;
    description: string;
    features: {
      icon: React.ComponentType<any>;
      title: string;
      description: string;
    }[];
    hasStepByStep?: boolean;
  }
  
  export class FeatureModalManager {
    private static readonly PREFIX = 'xolace_feature_modal_';
    private static readonly GLOBAL_DISMISS_KEY = 'xolace_global_feature_modals_dismissed';
  
    /**
     * Check if modal should be shown for a specific route
     */
    static shouldShowModal(route: string): boolean {
      if (typeof window === 'undefined') return false;
      
      // Check if globally dismissed
      const globalDismiss = localStorage.getItem(this.GLOBAL_DISMISS_KEY);
      if (globalDismiss === 'true') return false;
  
      // Check if this specific route modal was dismissed
      const routeKey = this.getStorageKey(route);
      const dismissed = localStorage.getItem(routeKey);
      return dismissed !== 'true';
    }
  
    /**
     * Mark modal as dismissed for specific route
     */
    static dismissModal(route: string): void {
      if (typeof window === 'undefined') return;
      
      const storageKey = this.getStorageKey(route);
      localStorage.setItem(storageKey, 'true');
    }
  
    /**
     * Mark all modals as dismissed globally
     */
    static dismissAllModals(): void {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem(this.GLOBAL_DISMISS_KEY, 'true');
    }
  
    /**
     * Reset modal state for specific route (for re-triggering)
     */
    static resetModal(route: string): void {
      if (typeof window === 'undefined') return;
      
      const storageKey = this.getStorageKey(route);
      localStorage.removeItem(storageKey);
    }
  
    /**
     * Reset all modal states
     */
    static resetAllModals(): void {
      if (typeof window === 'undefined') return;
      
      // Remove global dismiss
      localStorage.removeItem(this.GLOBAL_DISMISS_KEY);
      
      // Remove all route-specific dismissals
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  
    /**
     * Get storage key for route
     */
    private static getStorageKey(route: string): string {
      // Clean route path and create consistent key
      const cleanRoute = route.replace(/^\/+|\/+$/g, '').replace(/\//g, '_') || 'home';
      return `${this.PREFIX}${cleanRoute}`;
    }
  
    /**
     * Get all dismissed routes
     */
    static getDismissedRoutes(): string[] {
      if (typeof window === 'undefined') return [];
      
      const dismissedRoutes: string[] = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX) && localStorage.getItem(key) === 'true') {
          const route = key.replace(this.PREFIX, '').replace(/_/g, '/');
          dismissedRoutes.push(route === 'home' ? '/' : `/${route}`);
        }
      });
      return dismissedRoutes;
    }
  }