import { createServerFn } from '@tanstack/react-start';
import { and, asc, eq, isNull, notExists, sql } from 'drizzle-orm';
import { z } from 'zod';

import { clients, receipts, tourAttendees, tours } from '#/db/schema';
import { calculateAttendeeBilling } from '#/features/tour-attendees/lib/calculations';

export const getClientById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [client] = await db
      .select({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        phone: clients.phone,
        address: clients.address,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
      })
      .from(clients)
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
      .limit(1);

    if (!client) throw new Error('Client not found');
    return client;
  });

export const listClientBookings = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ clientId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const rows = await db
      .select({
        id: tourAttendees.id,
        tourId: tourAttendees.tourId,
        clientId: tourAttendees.clientId,
        adultCount: tourAttendees.adultCount,
        childCount: tourAttendees.childCount,
        adultCost: tourAttendees.adultCost,
        childCost: tourAttendees.childCost,
        adultGstPercent: tourAttendees.adultGstPercent,
        childGstPercent: tourAttendees.childGstPercent,
        discountAmount: tourAttendees.discountAmount,
        receivedAmount: sql<number>`coalesce((select sum(${receipts.amount}) from ${receipts} where ${receipts.attendeeId} = ${tourAttendees.id}), 0)::int`,
        createdAt: tourAttendees.createdAt,
        updatedAt: tourAttendees.updatedAt,
        tourName: tours.name,
        tourStartDate: tours.startDate,
        tourEndDate: tours.endDate,
        clientName: clients.name,
        clientEmail: clients.email,
        clientPhone: clients.phone,
      })
      .from(tourAttendees)
      .innerJoin(tours, eq(tours.id, tourAttendees.tourId))
      .innerJoin(clients, eq(clients.id, tourAttendees.clientId))
      .where(
        and(
          eq(tourAttendees.clientId, data.clientId),
          isNull(tourAttendees.deletedAt),
          isNull(tours.deletedAt),
          isNull(clients.deletedAt),
        ),
      )
      .orderBy(asc(tours.startDate), asc(tourAttendees.id));

    return rows.map((row) => ({ ...row, ...calculateAttendeeBilling(row) }));
  });

export const listAvailableToursForClient = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ clientId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const rows = await db
      .select({
        id: tours.id,
        name: tours.name,
        description: tours.description,
        startDate: tours.startDate,
        endDate: tours.endDate,
        createdAt: tours.createdAt,
        updatedAt: tours.updatedAt,
      })
      .from(tours)
      .where(
        and(
          isNull(tours.deletedAt),
          notExists(
            db
              .select({ value: sql`1` })
              .from(tourAttendees)
              .where(
                and(
                  eq(tourAttendees.tourId, tours.id),
                  eq(tourAttendees.clientId, data.clientId),
                  isNull(tourAttendees.deletedAt),
                ),
              ),
          ),
        ),
      )
      .orderBy(asc(tours.startDate), asc(tours.name));

    return rows;
  });

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
