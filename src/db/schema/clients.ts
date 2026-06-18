import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const clients = pgTable(
  'clients',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text().notNull(),
    address: text(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('clients_active_email_unique')
      .on(table.email)
      .where(sql`${table.deletedAt} IS NULL`),
    uniqueIndex('clients_active_phone_unique')
      .on(table.phone)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);
