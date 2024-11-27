"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Users,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-muted rounded-full p-3 w-fit">
          <Eye className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">The anonymous view you're looking for seems to have vanished into thin air.</p>
          <div className="mt-6 flex justify-center space-x-4">
            <Users className="h-16 w-16 text-primary" />
            <Wifi className="h-16 w-16 text-primary" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            onClick={() => router.push("/feed")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
