'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const getErrorDetails = () => {
    if (error.message.includes('Failed to fetch')) {
      return {
        title: 'Connection Error',
        message:
          'Oops! It seems your connection to the anonymous realm is lost.',
        icon: <WifiOff className="text-muted-foreground h-12 w-12" />,
      };
    }
    if (error.message.includes('Not found')) {
      return {
        title: 'Page Not Found',
        message:
          "The anonymous view you're looking for seems to have vanished into thin air.",
        icon: <Eye className="text-muted-foreground h-12 w-12" />,
      };
    }
    // Default error
    return {
      title: 'Unexpected Error',
      message:
        "An unexpected error occurred in the anonymous realm. Don't worry, your identity is still safe!",
      icon: <AlertCircle className="text-muted-foreground h-12 w-12" />,
    };
  };

  const { title, message, icon } = getErrorDetails();

  return (
    <div className="dark:bg-bg-dark bg-bg flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 w-fit rounded-full p-3">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">{message}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <Users className="text-primary h-16 w-16" />
            <Wifi className="text-primary h-16 w-16" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => reset()} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/feed')}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
