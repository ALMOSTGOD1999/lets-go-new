import { createServerFn } from '@tanstack/react-start';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';

import { clients, receipts, tourAttendees, tours } from '#/db/schema';
import type { TourAttendeeWithClient } from '#/features/tour-attendees/data/schema';
import {
  createTourAttendeeInputSchema,
  type TourAttendeeInput,
  updateTourAttendeeInputSchema,
} from '#/features/tour-attendees/data/schema';
import { calculateAttendeeBilling } from '#/features/tour-attendees/lib/calculations';

const selectTourAttendeeColumns = {
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
  createdAt: tourAttendees.createdAt,
  updatedAt: tourAttendees.updatedAt,
};

const receiptTotalSql = sql<number>`coalesce((select sum(${receipts.amount}) from ${receipts} where ${receipts.attendeeId} = ${tourAttendees.id}), 0)::int`;

export const getTourById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [tour] = await db
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
      .where(and(eq(tours.id, data.id), isNull(tours.deletedAt)))
      .limit(1);

    if (!tour) throw new Error('Tour not found');
    return tour;
  });

export const listTourAttendees = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ tourId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const rows = await db
      .select({
        ...selectTourAttendeeColumns,
        clientName: clients.name,
        clientEmail: clients.email,
        clientPhone: clients.phone,
        receivedAmount: receiptTotalSql,
      })
      .from(tourAttendees)
      .innerJoin(clients, eq(clients.id, tourAttendees.clientId))
      .where(
        and(
          eq(tourAttendees.tourId, data.tourId),
          isNull(tourAttendees.deletedAt),
          isNull(clients.deletedAt),
        ),
      )
      .orderBy(asc(clients.name), asc(tourAttendees.id));

    return rows.map(addBilling);
  });

export const createTourAttendee = createServerFn({ method: 'POST' })
  .inputValidator(createTourAttendeeInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [tour] = await db
      .select({ id: tours.id })
      .from(tours)
      .where(and(eq(tours.id, data.tourId), isNull(tours.deletedAt)))
      .limit(1);

    if (!tour) {
      throw new Error('Tour not found');
    }

    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(and(eq(clients.id, data.clientId), isNull(clients.deletedAt)))
      .limit(1);

    if (!client) {
      throw new Error('Client not found');
    }

    const [existing] = await db
      .select({ id: tourAttendees.id })
      .from(tourAttendees)
      .where(
        and(
          eq(tourAttendees.tourId, data.tourId),
          eq(tourAttendees.clientId, data.clientId),
          isNull(tourAttendees.deletedAt),
        ),
      )
      .limit(1);

    if (existing) {
      throw new Error('This client is already added to this tour');
    }

    const [row] = await db
      .insert(tourAttendees)
      .values({ ...data, updatedAt: new Date(), deletedAt: null })
      .returning(selectTourAttendeeColumns);

    return row;
  });

export const updateTourAttendee = createServerFn({ method: 'POST' })
  .inputValidator(updateTourAttendeeInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const { id, ...values } = data;
    const [row] = await db
      .update(tourAttendees)
      .set({ ...getPricingValues(values), updatedAt: new Date() })
      .where(and(eq(tourAttendees.id, id), isNull(tourAttendees.deletedAt)))
      .returning(selectTourAttendeeColumns);

    if (!row) {
      throw new Error('Attendee not found');
    }

    return row;
  });

function getPricingValues(data: TourAttendeeInput) {
  return {
    adultCount: data.adultCount,
    childCount: data.childCount,
    adultCost: data.adultCost,
    childCost: data.childCost,
    adultGstPercent: data.adultGstPercent,
    childGstPercent: data.childGstPercent,
    discountAmount: data.discountAmount,
  };
}

function addBilling(
  row: TourAttendeeInput & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    receivedAmount: number;
  },
): TourAttendeeWithClient {
  return {
    ...row,
    ...calculateAttendeeBilling(row),
  };
}

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
