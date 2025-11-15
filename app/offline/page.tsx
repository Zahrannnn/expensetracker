'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-6 w-6 text-muted-foreground" />
            You&apos;re Offline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            No internet connection detected. Please check your connection and try again.
          </p>
          <p className="text-sm text-muted-foreground">
            Your data is saved locally and will sync when you&apos;re back online.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

