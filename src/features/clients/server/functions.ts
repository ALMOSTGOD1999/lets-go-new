import { createServerFn } from '@tanstack/react-start';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  sql,
} from 'drizzle-orm';

import { clients, tourAttendees } from '#/db/schema';
import {
  createClientInputSchema,
  listClientsInputSchema,
  updateClientInputSchema,
} from '#/features/clients/data/schema';

const selectClientColumns = {
  id: clients.id,
  name: clients.name,
  email: clients.email,
  phone: clients.phone,
  address: clients.address,
  createdAt: clients.createdAt,
  updatedAt: clients.updatedAt,
  bookingCount: sql<number>`(
    SELECT count(*)::int
    FROM ${tourAttendees}
    WHERE ${tourAttendees.clientId} = ${clients.id}
      AND ${tourAttendees.deletedAt} IS NULL
  )`.as('booking_count'),
};

const sortColumns = {
  name: clients.name,
  email: clients.email,
  phone: clients.phone,
};

export const listClients = createServerFn({ method: 'GET' })
  .inputValidator(listClientsInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const search = data.search.trim();
    const filters = [isNull(clients.deletedAt)];

    if (search) {
      const pattern = `%${search}%`;
      const searchFilter = or(
        ilike(clients.name, pattern),
        ilike(clients.email, pattern),
        ilike(clients.phone, pattern),
        ilike(clients.address, pattern),
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    const where = and(...filters);
    const offset = (data.page - 1) * data.pageSize;
    const sortColumn = sortColumns[data.sortBy];
    const orderBy =
      data.sortDirection === 'desc' ? desc(sortColumn) : asc(sortColumn);

    const [rows, totalRows] = await Promise.all([
      db
        .select(selectClientColumns)
        .from(clients)
        .where(where)
        .orderBy(orderBy, desc(clients.id))
        .limit(data.pageSize)
        .offset(offset),
      db.select({ value: count() }).from(clients).where(where),
    ]);

    const total = totalRows[0]?.value ?? 0;

    return {
      data: rows,
      page: data.page,
      pageSize: data.pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / data.pageSize)),
    };
  });

export const createClient = createServerFn({ method: 'POST' })
  .inputValidator(createClientInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const values = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      address: data.address?.trim() || null,
      updatedAt: now,
      deletedAt: null,
    };

    const [softDeletedClient] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          isNotNull(clients.deletedAt),
          or(eq(clients.email, values.email), eq(clients.phone, values.phone)),
        ),
      )
      .limit(1);

    if (softDeletedClient) {
      const [restoredClient] = await db
        .update(clients)
        .set(values)
        .where(eq(clients.id, softDeletedClient.id))
        .returning(selectClientColumns);

      return restoredClient;
    }

    const [createdClient] = await db
      .insert(clients)
      .values(values)
      .returning(selectClientColumns);

    return createdClient;
  });

export const updateClient = createServerFn({ method: 'POST' })
  .inputValidator(updateClientInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updatedClient] = await db
      .update(clients)
      .set({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address?.trim() || null,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
      .returning(selectClientColumns);

    if (!updatedClient) {
      throw new Error('Client not found');
    }

    return updatedClient;
  });

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
