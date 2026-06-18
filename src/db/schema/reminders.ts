import { sql } from 'drizzle-orm';
import { check, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const reminders = pgTable(
  'reminders',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    message: text().notNull(),
    notes: text(),
    scheduledAt: timestamp('scheduled_at').notNull(),
    timezone: text().default('Asia/Kolkata').notNull(),
    type: text().default('general').notNull(),
    relatedEntityType: text('related_entity_type'),
    relatedEntityId: integer('related_entity_id'),
    relatedLabel: text('related_label'),
    targetPath: text('target_path').default('/reminders').notNull(),
    status: text().default('upcoming').notNull(),
    sentAt: timestamp('sent_at'),
    failedAt: timestamp('failed_at'),
    cancelledAt: timestamp('cancelled_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      'reminders_status_check',
      sql`${table.status} in ('upcoming', 'sent', 'failed', 'cancelled')`,
    ),
    check(
      'reminders_type_check',
      sql`${table.type} in ('receipt', 'voucher', 'attendee', 'general')`,
    ),
  ],
);
