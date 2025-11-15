'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa-register';
import { PWAInstallPrompt } from '@/components/shared/PWAInstallPrompt';
import { PWAUpdateNotification } from '@/components/shared/PWAUpdateNotification';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      {children}
      <PWAInstallPrompt />
      <PWAUpdateNotification />
    </>
  );
}

