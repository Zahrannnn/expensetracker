'use client';

import { useEffect, useState } from 'react';
import { useHydrated } from '@/lib/useExpenseStore';

export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

