'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function PWAUpdateNotification() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates every hour
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              toast.info('Update Available', {
                description: 'A new version is available. Refresh to update.',
                action: {
                  label: 'Update Now',
                  onClick: handleUpdate,
                },
                duration: Infinity,
                icon: <RefreshCw className="h-4 w-4" />,
              });
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload after a short delay to allow the new SW to take control
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return null;
}

