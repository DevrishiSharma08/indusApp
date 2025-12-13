'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');


    if (user) {
      router.replace('/dashboard'); 
       console.log (user)
    } else {
      router.replace('/login');
    }

    setLoading(false);
  }, [router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full">
            <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold">
              IndusInternalApp
            </h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}