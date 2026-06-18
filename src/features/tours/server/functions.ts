import { createServerFn } from '@tanstack/react-start';
import { and, asc, count, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';

import { tourAttendees, tours } from '#/db/schema';
import {
  createTourInputSchema,
  listToursInputSchema,
  updateTourInputSchema,
} from '#/features/tours/data/schema';

const selectTourColumns = {
  id: tours.id,
  name: tours.name,
  description: tours.description,
  startDate: tours.startDate,
  endDate: tours.endDate,
  createdAt: tours.createdAt,
  updatedAt: tours.updatedAt,
  attendeeCount: sql<number>`(
    SELECT count(*)::int
    FROM ${tourAttendees}
    WHERE ${tourAttendees.tourId} = ${tours.id}
      AND ${tourAttendees.deletedAt} IS NULL
  )`.as('attendee_count'),
};

const sortColumns = {
  name: tours.name,
  startDate: tours.startDate,
  endDate: tours.endDate,
};

export const listTours = createServerFn({ method: 'GET' })
  .inputValidator(listToursInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const search = data.search.trim();
    const filters = [isNull(tours.deletedAt)];

    if (search) {
      const pattern = `%${search}%`;
      const searchFilter = or(
        ilike(tours.name, pattern),
        ilike(tours.description, pattern),
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
        .select(selectTourColumns)
        .from(tours)
        .where(where)
        .orderBy(orderBy, desc(tours.id))
        .limit(data.pageSize)
        .offset(offset),
      db.select({ value: count() }).from(tours).where(where),
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

export const createTour = createServerFn({ method: 'POST' })
  .inputValidator(createTourInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [createdTour] = await db
      .insert(tours)
      .values(getTourValues(data))
      .returning(selectTourColumns);

    return createdTour;
  });

export const updateTour = createServerFn({ method: 'POST' })
  .inputValidator(updateTourInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updatedTour] = await db
      .update(tours)
      .set(getTourValues(data))
      .where(and(eq(tours.id, data.id), isNull(tours.deletedAt)))
      .returning(selectTourColumns);

    if (!updatedTour) {
      throw new Error('Tour not found');
    }

    return updatedTour;
  });

function getTourValues(data: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}) {
  const description = data.description?.trim();

  return {
    name: data.name.trim(),
    description: description || null,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    updatedAt: new Date(),
    deletedAt: null,
  };
}

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
