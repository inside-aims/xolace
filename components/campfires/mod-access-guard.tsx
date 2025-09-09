import React from 'react';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ModAccessGuardProps {
  error?: string;
  slug: string;
}

export const ModAccessDenied: React.FC<ModAccessGuardProps> = ({ error, slug }) => {
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
        </div>
        
        <div className="flex flex-col gap-3">
          <Link href={`/x/${slug}`}>
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Campfire
            </Button>
          </Link>
          <Link href="/campfires/discover">
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
};