import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';

const OFFLINE_TOAST_ID = 'offline-status';
const UPDATE_TOAST_ID = 'service-worker-update';
const INSTALL_TOAST_ID = 'pwa-install';
const INSTALL_PROMPT_KEY = 'letsgo-pwa-install-prompt-dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function PwaEvents() {
  const offline = useOfflineIndicator();
  useServiceWorkerUpdates();
  usePwaInstallPrompt();

  return (
    <AlertDialog open={offline}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No internet connection</AlertDialogTitle>
          <AlertDialogDescription>
            You are offline. The current page will stay open, but app actions
            are blocked until your connection is restored.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function useOfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return;
    }

    const showOfflineToast = () => {
      setOffline(true);
      toast.warning(
        'No internet connection. Some features may be unavailable.',
        {
          id: OFFLINE_TOAST_ID,
          duration: Number.POSITIVE_INFINITY,
        },
      );
    };

    const showOnlineToast = () => {
      setOffline(false);
      toast.dismiss(OFFLINE_TOAST_ID);
      toast.success('Back online', { duration: 3000 });
    };

    if (!navigator.onLine) {
      showOfflineToast();
    }

    window.addEventListener('offline', showOfflineToast);
    window.addEventListener('online', showOnlineToast);

    return () => {
      window.removeEventListener('offline', showOfflineToast);
      window.removeEventListener('online', showOnlineToast);
    };
  }, []);

  return offline;
}

function usePwaInstallPrompt() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalonePwa()) return;
    if (localStorage.getItem(INSTALL_PROMPT_KEY)) return;

    const showIosInstallHint = window.setTimeout(() => {
      if (!isIosDevice() || isStandalonePwa()) return;

      toast.info('Install LetsGo for reliable reminders.', {
        id: INSTALL_TOAST_ID,
        description: 'Tap Share, then Add to Home Screen.',
        duration: Number.POSITIVE_INFINITY,
        cancel: {
          label: 'Not now',
          onClick: () => localStorage.setItem(INSTALL_PROMPT_KEY, 'true'),
        },
      });
    }, 2500);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.clearTimeout(showIosInstallHint);

      const installEvent = event as BeforeInstallPromptEvent;
      toast.info('Install LetsGo for app-like access and reminders.', {
        id: INSTALL_TOAST_ID,
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: 'Install',
          onClick: async () => {
            await installEvent.prompt();
            const choice = await installEvent.userChoice;

            if (choice.outcome === 'dismissed') {
              localStorage.setItem(INSTALL_PROMPT_KEY, 'true');
            }
          },
        },
        cancel: {
          label: 'Not now',
          onClick: () => localStorage.setItem(INSTALL_PROMPT_KEY, 'true'),
        },
      });
    };

    const onAppInstalled = () => {
      localStorage.setItem(INSTALL_PROMPT_KEY, 'true');
      toast.dismiss(INSTALL_TOAST_ID);
      toast.success('LetsGo installed');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.clearTimeout(showIosInstallHint);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);
}

function useServiceWorkerUpdates() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void navigator.serviceWorker?.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
      return;
    }

    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;
    let refreshing = false;

    const reloadWhenControlled = () => {
      if (refreshing) {
        return;
      }

      refreshing = true;
      window.location.reload();
    };

    const showReloadPrompt = (nextRegistration: ServiceWorkerRegistration) => {
      registration = nextRegistration;

      toast.info('A new version of LetsGo is available.', {
        id: UPDATE_TOAST_ID,
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: 'Reload',
          onClick: () => {
            if (registration?.waiting) {
              navigator.serviceWorker.addEventListener(
                'controllerchange',
                reloadWhenControlled,
                { once: true },
              );
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              return;
            }

            window.location.reload();
          },
        },
      });
    };

    const registerServiceWorker = async () => {
      const nextRegistration = await navigator.serviceWorker.register(
        '/sw.js',
        {
          scope: '/',
        },
      );

      if (nextRegistration.waiting && navigator.serviceWorker.controller) {
        showReloadPrompt(nextRegistration);
      }

      nextRegistration.addEventListener('updatefound', () => {
        const nextWorker = nextRegistration.installing;

        nextWorker?.addEventListener('statechange', () => {
          if (
            nextWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            showReloadPrompt(nextRegistration);
          }
        });
      });
    };

    const registerTimer = window.setTimeout(() => {
      void registerServiceWorker().catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    }, 1000);

    return () => {
      window.clearTimeout(registerTimer);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        reloadWhenControlled,
      );
    };
  }, []);
}

function isStandalonePwa() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && navigator.standalone === true)
  );
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
