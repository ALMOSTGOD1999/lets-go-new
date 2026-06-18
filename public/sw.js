const CACHE_VERSION = 'letsgo';
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const APP_SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-152x152.png',
  '/logo192.png',
  '/logo512.png',
  '/og-image.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([deleteOldCaches(), self.clients.claim()]),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  event.waitUntil(showReminderPushNotifications(parsePushPayload(event.data)));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') {
    return;
  }

  const url = event.notification.data?.url || '/reminders';
  event.waitUntil(openClientUrl(url));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (isApiRequest(url)) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheAppShell() {
  const cache = await caches.open(APP_SHELL_CACHE);

  await Promise.allSettled(
    APP_SHELL_ASSETS.map(async (asset) => {
      const response = await fetch(asset, { cache: 'reload' });

      if (response.ok) {
        await cache.put(asset, response);
      }
    }),
  );
}

async function deleteOldCaches() {
  const expectedCaches = new Set([APP_SHELL_CACHE, STATIC_CACHE]);
  const cacheNames = await caches.keys();

  await Promise.all(
    cacheNames.map((cacheName) => {
      if (expectedCaches.has(cacheName)) {
        return undefined;
      }

      return caches.delete(cacheName);
    }),
  );
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(APP_SHELL_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match('/')) ||
      new Response('No internet connection. Some features may be unavailable.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        status: 503,
      })
    );
  }
}

async function openClientUrl(url) {
  const target = new URL(url, self.location.origin);
  const targetUrl =
    target.origin === self.location.origin
      ? target.href
      : new URL('/reminders', self.location.origin).href;
  const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    if ('focus' in client) {
      await client.focus();
      if ('navigate' in client) {
        return client.navigate(targetUrl);
      }
      return undefined;
    }
  }
  return clients.openWindow(targetUrl);
}

async function showReminderPushNotifications(payload) {
  const reminders = Array.isArray(payload?.reminders) ? payload.reminders : [];

  await Promise.all(
    reminders.map((reminder) => {
      const body = [reminder.message, reminder.relatedLabel]
        .filter(Boolean)
        .join('\n');

      return self.registration.showNotification(reminder.title, {
        body,
        icon: '/logo192.png',
        badge: '/favicon-32x32.png',
        timestamp: Date.parse(reminder.scheduledAt) || Date.now(),
        tag: `reminder-${reminder.id}`,
        renotify: true,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
        data: { url: reminder.targetPath || '/reminders', reminderId: reminder.id },
      });
    }),
  );
}

function parsePushPayload(data) {
  try {
    return data?.json();
  } catch {
    return null;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return new Response(null, { status: 408 });
  }
}

function isApiRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_server/') ||
    url.pathname.startsWith('/_serverFn/') ||
    url.pathname.includes('/_server/') ||
    url.pathname.includes('/_serverFn/')
  );
}

function isStaticAsset(request) {
  return ['font', 'image', 'manifest', 'script', 'style', 'worker'].includes(
    request.destination,
  );
}
