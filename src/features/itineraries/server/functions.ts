import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike, isNull, or } from "drizzle-orm";

import { itineraries } from "#/db/schema";
import {
  createItineraryInputSchema,
  listItinerariesInputSchema,
  updateItineraryInputSchema,
} from "#/features/itineraries/data/schema";

const selectItineraryColumns = {
  id: itineraries.id,
  title: itineraries.title,
  destination: itineraries.destination,
  days: itineraries.days,
  nights: itineraries.nights,
  overview: itineraries.overview,
  price: itineraries.price,
  dayDetails: itineraries.dayDetails,
  createdAt: itineraries.createdAt,
  updatedAt: itineraries.updatedAt,
};

const sortColumns = {
  title: itineraries.title,
  destination: itineraries.destination,
  days: itineraries.days,
};

export const listItineraries = createServerFn({ method: "GET" })
  .inputValidator(listItinerariesInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const search = data.search.trim();
    const filters = [isNull(itineraries.deletedAt)];

    if (search) {
      const pattern = `%${search}%`;
      const searchFilter = or(
        ilike(itineraries.title, pattern),
        ilike(itineraries.destination, pattern),
        ilike(itineraries.overview, pattern),
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    const where = and(...filters);
    const offset = (data.page - 1) * data.pageSize;
    const sortColumn = sortColumns[data.sortBy];
    const orderBy =
      data.sortDirection === "desc" ? desc(sortColumn) : asc(sortColumn);

    const [rows, totalRows] = await Promise.all([
      db
        .select(selectItineraryColumns)
        .from(itineraries)
        .where(where)
        .orderBy(orderBy, desc(itineraries.id))
        .limit(data.pageSize)
        .offset(offset),
      db.select({ value: count() }).from(itineraries).where(where),
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

export const createItinerary = createServerFn({ method: "POST" })
  .inputValidator(createItineraryInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();

    const [created] = await db
      .insert(itineraries)
      .values({
        id: generateId(),
        title: data.title.trim(),
        destination: data.destination.trim(),
        days: data.days,
        nights: data.nights,
        overview: data.overview?.trim() || null,
        price: data.price ?? null,
        dayDetails: data.dayDetails?.length ? data.dayDetails : null,
        updatedAt: now,
      })
      .returning(selectItineraryColumns);

    return created;
  });

export const updateItinerary = createServerFn({ method: "POST" })
  .inputValidator(updateItineraryInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();

    const [updated] = await db
      .update(itineraries)
      .set({
        title: data.title.trim(),
        destination: data.destination.trim(),
        days: data.days,
        nights: data.nights,
        overview: data.overview?.trim() || null,
        price: data.price ?? null,
        dayDetails: data.dayDetails?.length ? data.dayDetails : null,
        updatedAt: new Date(),
      })
      .where(and(eq(itineraries.id, data.id), isNull(itineraries.deletedAt)))
      .returning(selectItineraryColumns);

    if (!updated) {
      throw new Error("Itinerary not found");
    }

    return updated;
  });

export const deleteItinerary = createServerFn({ method: "POST" })
  .inputValidator(updateItineraryInputSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const db = await getServerDb();

    await db
      .update(itineraries)
      .set({ deletedAt: new Date() })
      .where(and(eq(itineraries.id, data.id), isNull(itineraries.deletedAt)));

    return { success: true };
  });

async function getServerDb() {
  const { getDb } = await import("#/db/index.server");
  return getDb();
}

function generateId(): string {
  // Generate a 24-character ID (similar to what the backend uses with cuid)
  const timestamp = Date.now().toString(36);
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return (timestamp + random).slice(0, 24);
}
