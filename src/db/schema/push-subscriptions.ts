import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth';

export const pushSubscriptions = pgTable('push_subscriptions', {
  endpoint: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  p256dh: text().notNull(),
  auth: text().notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
