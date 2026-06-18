import { createServerFn } from '@tanstack/react-start';
import { and, asc, desc, eq, gte, inArray, lt, lte, ne, or } from 'drizzle-orm';
import { z } from 'zod';

import { reminders } from '#/db/schema';
import {
  type ReminderStatus,
  type ReminderType,
  reminderFormSchema,
  updateReminderSchema,
} from '#/features/reminders/data/schema';

const idSchema = z.object({ id: z.number().int().positive() });
const syncSchema = z.object({
  daysAhead: z.number().int().min(1).max(30).default(7),
});

export const listReminders = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = await getServerDb();
    const rows = await db
      .select()
      .from(reminders)
      .orderBy(asc(reminders.scheduledAt), desc(reminders.id));
    return rows.map(normalizeReminder);
  },
);

export const listSyncReminders = createServerFn({ method: 'GET' })
  .inputValidator(syncSchema)
  .handler(async ({ data }) => {
    await pruneOldSentReminders();
    const db = await getServerDb();
    const now = new Date();
    const lateWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + data.daysAhead * 24 * 60 * 60 * 1000);
    const rows = await db
      .select()
      .from(reminders)
      .where(
        and(
          ne(reminders.status, 'cancelled'),
          gte(reminders.scheduledAt, lateWindow),
          lt(reminders.scheduledAt, end),
        ),
      )
      .orderBy(asc(reminders.scheduledAt), asc(reminders.id));
    return rows.map(normalizeReminder);
  });

export const createReminder = createServerFn({ method: 'POST' })
  .inputValidator(reminderFormSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .insert(reminders)
      .values(toReminderValues(data))
      .returning();
    return normalizeReminder(row);
  });

export const updateReminder = createServerFn({ method: 'POST' })
  .inputValidator(updateReminderSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const { id, ...values } = data;
    const [row] = await db
      .update(reminders)
      .set({
        ...toReminderValues(values),
        status: 'upcoming',
        sentAt: null,
        failedAt: null,
        cancelledAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(reminders.id, id), eq(reminders.status, 'upcoming')))
      .returning();
    if (!row) throw new Error('Reminder not found or already sent');
    return normalizeReminder(row);
  });

export const cancelReminder = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .update(reminders)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(reminders.id, data.id))
      .returning();
    if (!row) throw new Error('Reminder not found');
    return normalizeReminder(row);
  });

export const markReminderSent = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .update(reminders)
      .set({ status: 'sent', sentAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(reminders.id, data.id),
          or(eq(reminders.status, 'upcoming'), eq(reminders.status, 'failed')),
        ),
      )
      .returning();
    return row ? normalizeReminder(row) : { ok: true };
  });

export const markReminderFailed = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db
      .update(reminders)
      .set({ status: 'failed', failedAt: new Date(), updatedAt: new Date() })
      .where(eq(reminders.id, data.id));
    return { ok: true };
  });

export async function listCurrentReminderPushes() {
  const db = await getServerDb();
  const now = new Date();

  const rows = await db
    .select()
    .from(reminders)
    .where(
      and(eq(reminders.status, 'upcoming'), lte(reminders.scheduledAt, now)),
    )
    .orderBy(asc(reminders.scheduledAt), asc(reminders.id));

  return rows.map(normalizeReminder);
}

export async function markReminderPushesSent(ids: number[]) {
  if (!ids.length) return;

  const db = await getServerDb();
  const now = new Date();

  await db
    .update(reminders)
    .set({ status: 'sent', sentAt: now, updatedAt: now })
    .where(inArray(reminders.id, ids));
}

export async function markReminderPushesFailed(ids: number[]) {
  if (!ids.length) return;

  const db = await getServerDb();
  const now = new Date();

  await db
    .update(reminders)
    .set({ status: 'failed', failedAt: now, updatedAt: now })
    .where(inArray(reminders.id, ids));
}

export async function pruneOldSentReminders() {
  const db = await getServerDb();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await db
    .delete(reminders)
    .where(and(eq(reminders.status, 'sent'), lt(reminders.sentAt, cutoff)));
}

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}

function toReminderValues(data: z.output<typeof reminderFormSchema>) {
  return {
    title: data.title.trim(),
    message: data.message.trim(),
    notes: normalizeText(data.notes),
    scheduledAt: parseIstDateTime(data.scheduledAt),
    timezone: 'Asia/Kolkata',
    type: data.type,
    relatedEntityType: normalizeText(data.relatedEntityType),
    relatedEntityId: data.relatedEntityId ?? null,
    relatedLabel: normalizeText(data.relatedLabel),
    targetPath: data.targetPath.trim() || '/reminders',
    updatedAt: new Date(),
  };
}

function normalizeReminder(row: typeof reminders.$inferSelect) {
  return {
    ...row,
    status: row.status as ReminderStatus,
    type: row.type as ReminderType,
  };
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseIstDateTime(value: string) {
  return new Date(`${value}:00+05:30`);
}
