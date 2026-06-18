import {
  buildPushHTTPRequest,
  type PushSubscription,
} from '@pushforge/builder';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { pushSubscriptions } from '#/db/schema';
import type { Reminder } from '#/features/reminders/data/schema';

const VAPID_PUBLIC_KEY_ENV = 'VAPID_PUBLIC_KEY';
const VAPID_PRIVATE_KEY_ENV = 'VAPID_PRIVATE_KEY';
const VAPID_SUBJECT_ENV = 'VAPID_SUBJECT';
const DEFAULT_PUSH_TTL_SECONDS = 24 * 60 * 60;

export const pushSubscriptionSchema = z.object({
  endpoint: z.url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;

type ReminderWebPushResult = {
  deliveredSubscriptions: number;
  expiredSubscriptions: number;
  failedSubscriptions: number;
};

type ReminderPushPayload = {
  reminders: Array<{
    id: number;
    title: string;
    message: string;
    relatedLabel: string | null;
    targetPath: string;
    scheduledAt: string;
  }>;
};

export function getVapidPublicKey() {
  return process.env[VAPID_PUBLIC_KEY_ENV] ?? null;
}

export function getMissingWebPushEnvVars() {
  return [VAPID_PUBLIC_KEY_ENV, VAPID_PRIVATE_KEY_ENV].filter(
    (key) => !process.env[key],
  );
}

export async function savePushSubscription({
  userId,
  userAgent,
  subscription,
}: {
  userId: string;
  userAgent: string | null;
  subscription: PushSubscriptionInput;
}) {
  const db = await getServerDb();
  await db
    .insert(pushSubscriptions)
    .values({
      endpoint: subscription.endpoint,
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        updatedAt: new Date(),
      },
    });
}

export async function deletePushSubscription(
  endpoint: string,
  userId?: string,
) {
  const db = await getServerDb();
  await db
    .delete(pushSubscriptions)
    .where(
      userId
        ? and(
            eq(pushSubscriptions.endpoint, endpoint),
            eq(pushSubscriptions.userId, userId),
          )
        : eq(pushSubscriptions.endpoint, endpoint),
    );
}

export async function sendReminderWebPushes(reminders: Reminder[]) {
  if (!reminders.length) {
    return {
      deliveredSubscriptions: 0,
      expiredSubscriptions: 0,
      failedSubscriptions: 0,
    } satisfies ReminderWebPushResult;
  }

  const privateJWK = getVapidPrivateJWK();
  const adminContact = getVapidAdminContact();

  const db = await getServerDb();
  const subscriptions = await db.select().from(pushSubscriptions);
  const payload = toReminderPushPayload(reminders);
  let deliveredSubscriptions = 0;
  let expiredSubscriptions = 0;
  let failedSubscriptions = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        const request = await buildPushHTTPRequest({
          privateJWK,
          subscription: toPushForgeSubscription(subscription),
          message: {
            payload,
            adminContact,
            options: {
              ttl: DEFAULT_PUSH_TTL_SECONDS,
              urgency: 'high',
              topic: 'reminders-due',
            },
          },
        });

        const response = await fetch(request.endpoint, {
          method: 'POST',
          headers: request.headers,
          body: request.body,
        });

        if (!response.ok) {
          const body = await response.text().catch(() => null);

          if (isStaleSubscriptionResponse(response.status, body)) {
            expiredSubscriptions += 1;
            await deletePushSubscription(subscription.endpoint);
            return;
          }

          failedSubscriptions += 1;
          console.error('Reminder web push failed', {
            endpoint: subscription.endpoint,
            status: response.status,
            body,
          });
          return;
        }

        deliveredSubscriptions += 1;
      } catch (error) {
        failedSubscriptions += 1;
        console.error('Failed to send reminder push notification', error);
      }
    }),
  );

  return {
    deliveredSubscriptions,
    expiredSubscriptions,
    failedSubscriptions,
  } satisfies ReminderWebPushResult;
}

function getVapidPrivateJWK() {
  const privateKey = process.env[VAPID_PRIVATE_KEY_ENV];

  if (!privateKey) {
    throw new Error(
      `${VAPID_PRIVATE_KEY_ENV} is required as a PushForge VAPID JWK JSON string`,
    );
  }

  try {
    return JSON.parse(privateKey) as JsonWebKey;
  } catch {
    throw new Error(
      `${VAPID_PRIVATE_KEY_ENV} must be a PushForge VAPID private JWK JSON string. Generate keys with: bunx @pushforge/builder vapid`,
    );
  }
}

function getVapidAdminContact() {
  return process.env[VAPID_SUBJECT_ENV] ?? 'mailto:admin@letsgo.local';
}

function toPushForgeSubscription(subscription: {
  endpoint: string;
  p256dh: string;
  auth: string;
}): PushSubscription {
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };
}

function toReminderPushPayload(reminders: Reminder[]): ReminderPushPayload {
  return {
    reminders: reminders.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      message: reminder.message,
      relatedLabel: reminder.relatedLabel ?? null,
      targetPath: reminder.targetPath,
      scheduledAt: new Date(reminder.scheduledAt).toISOString(),
    })),
  };
}

function isStaleSubscriptionResponse(status: number, body: string | null) {
  if (status === 404 || status === 410) {
    return true;
  }

  return (
    status === 403 &&
    body?.includes('VAPID credentials') === true &&
    body.includes('do not correspond')
  );
}

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
