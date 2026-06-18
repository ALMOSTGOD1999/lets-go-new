import { Link } from '@tanstack/react-router';
import { BellIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '#/components/ui/button';

const PERMISSION_PROMPT_KEY = 'letsgo-notification-permission-asked';
const PERMISSION_PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const PUSH_SUBSCRIPTION_ENDPOINT = '/api/reminders/push-subscription';

export function RemindersRuntime() {
  useNotificationPermissionPrompt();

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    void subscribeToWebPush().catch((error) => {
      console.error('Unable to subscribe to reminder push:', error);
    });
  }, []);

  return null;
}

export function ReminderBell() {
  return (
    <Button
      nativeButton={false}
      render={<Link to="/reminders" />}
      size="icon"
      variant="outline"
      className="fixed top-4 right-4 z-30 shadow-sm"
    >
      <BellIcon />
      <span className="sr-only">Open reminders</span>
    </Button>
  );
}

function useNotificationPermissionPrompt() {
  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    if (!canShowPermissionPrompt()) return;

    const timer = window.setTimeout(() => {
      toast.info('Enable browser reminders on this device?', {
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: 'Enable',
          onClick: () => {
            rememberPermissionPrompt();
            void Notification.requestPermission().then((permission) => {
              if (permission === 'granted') return subscribeToWebPush();
              return undefined;
            });
          },
        },
        cancel: {
          label: 'Later',
          onClick: rememberPermissionPrompt,
        },
      });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);
}

async function subscribeToWebPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const [{ publicKey }, registration] = await Promise.all([
    fetch(PUSH_SUBSCRIPTION_ENDPOINT).then((response) => {
      if (!response.ok) throw new Error('Unable to load VAPID public key');
      return response.json() as Promise<{ publicKey: string }>;
    }),
    navigator.serviceWorker.ready,
  ]);
  if (!isValidBase64Url(publicKey)) {
    throw new Error('VAPID_PUBLIC_KEY is missing or is not a valid base64url public key');
  }

  const applicationServerKey = urlBase64ToArrayBuffer(publicKey);
  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription = await getCurrentPushSubscription({
    existingSubscription,
    registration,
    applicationServerKey,
  });

  const response = await fetch(PUSH_SUBSCRIPTION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  });

  if (!response.ok) {
    throw new Error('Unable to save push subscription');
  }
}

async function getCurrentPushSubscription({
  existingSubscription,
  registration,
  applicationServerKey,
}: {
  existingSubscription: PushSubscription | null;
  registration: ServiceWorkerRegistration;
  applicationServerKey: ArrayBuffer;
}) {
  if (
    existingSubscription &&
    !subscriptionUsesApplicationServerKey(
      existingSubscription,
      applicationServerKey,
    )
  ) {
    await removeSavedPushSubscription(existingSubscription);
    await existingSubscription.unsubscribe();
    existingSubscription = null;
  }

  return (
    existingSubscription ??
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
  );
}

function subscriptionUsesApplicationServerKey(
  subscription: PushSubscription,
  applicationServerKey: ArrayBuffer,
) {
  const existingKey = subscription.options.applicationServerKey;

  if (!existingKey) {
    return false;
  }

  return arrayBufferEquals(existingKey, applicationServerKey);
}

async function removeSavedPushSubscription(subscription: PushSubscription) {
  await fetch(PUSH_SUBSCRIPTION_ENDPOINT, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => undefined);
}

function isValidBase64Url(value: string) {
  return /^[A-Za-z0-9_-]+={0,2}$/.test(value) && value.length > 0;
}

function urlBase64ToArrayBuffer(value: string) {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputBuffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(outputBuffer);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputBuffer;
}

function arrayBufferEquals(left: ArrayBuffer, right: ArrayBuffer) {
  if (left.byteLength !== right.byteLength) {
    return false;
  }

  const leftView = new Uint8Array(left);
  const rightView = new Uint8Array(right);

  for (let index = 0; index < leftView.length; index += 1) {
    if (leftView[index] !== rightView[index]) {
      return false;
    }
  }

  return true;
}

function canShowPermissionPrompt() {
  const lastPromptedAt = Number(localStorage.getItem(PERMISSION_PROMPT_KEY));

  return (
    !Number.isFinite(lastPromptedAt) ||
    Date.now() - lastPromptedAt >= PERMISSION_PROMPT_COOLDOWN_MS
  );
}

function rememberPermissionPrompt() {
  localStorage.setItem(PERMISSION_PROMPT_KEY, String(Date.now()));
}
