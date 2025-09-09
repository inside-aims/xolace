// components/mods/shared/mod-access-guard.tsx
import React from 'react';
import { Shield, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Loader2Component from '@/components/shared/loaders/Loader2';

interface ModAccessGuardProps {
  hasAccess: boolean | null;
  loading: boolean;
  error?: string;
  slug: string;
  userRole?: string;
  children: React.ReactNode;
}

export const ModAccessGuard: React.FC<ModAccessGuardProps> = ({ 
  hasAccess, 
  loading, 
  error, 
  slug, 
  userRole,
  children 
}) => {
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2Component message="Verifying permissions..." />
      </div>
    );
  }

  // Show access denied state
  if (hasAccess === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'You do not have permission to view this page. Only moderators (Firestarters and Firekeepers) can access mod tools.'}
            </p>
            
            {/* Show current role if user is a member but not a mod */}
            {userRole && userRole === 'camper' && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-yellow-800 dark:text-yellow-200">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">You are currently a Camper</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Link href={`/c/${slug}`}>
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Campfire
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="outline" className="w-full">
                Discover Campfires
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Need mod access?</p>
                <p>Contact the campfire&apos;s Firestarter or existing Firekeepers to request moderator permissions.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};