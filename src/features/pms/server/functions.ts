import { createServerFn } from "@tanstack/react-start";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  customers,
  destinations,
  doAndDonts,
  emailTemplates,
  quotationFeatures,
  quotations,
  roomTypes,
} from "#/db/schema";
import {
  createCustomerInputSchema,
  createDestinationInputSchema,
  createDoAndDontInputSchema,
  createEmailTemplateInputSchema,
  createQuotationFeatureInputSchema,
  createQuotationInputSchema,
  createRoomTypeInputSchema,
  updateCustomerInputSchema,
  updateDestinationInputSchema,
  updateDoAndDontInputSchema,
  updateEmailTemplateInputSchema,
  updateQuotationFeatureInputSchema,
  updateQuotationInputSchema,
  updateRoomTypeInputSchema,
} from "#/features/pms/data/schema";

// ─── Helpers ──────────────────────────────────────────────────────

const idParamSchema = z.object({ id: z.string() });
const itineraryParamSchema = z.object({ itineraryId: z.string() });
const quotationParamSchema = z.object({ quotationId: z.string() });
const destinationFilterSchema = z.object({
  destinationId: z.string().optional(),
});

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return (timestamp + random).slice(0, 24);
}

async function getServerDb() {
  const { getDb } = await import("#/db/index.server");
  return getDb();
}

// ─── Destinations ──────────────────────────────────────────────────

export const listDestinations = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getServerDb();
    return db.select().from(destinations).orderBy(asc(destinations.name));
  },
);

export const createDestination = createServerFn({ method: "POST" })
  .inputValidator(createDestinationInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(destinations)
      .values({
        id: generateId(),
        name: data.name,
        description: data.description,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateDestination = createServerFn({ method: "POST" })
  .inputValidator(updateDestinationInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(destinations)
      .set({
        name: data.name,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(destinations.id, data.id))
      .returning();
    if (!updated) throw new Error("Destination not found");
    return updated;
  });

export const deleteDestination = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(destinations).where(eq(destinations.id, data.id));
    return { success: true };
  });

// ─── Customers ────────────────────────────────────────────────────

export const listCustomers = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getServerDb();
    return db.select().from(customers).orderBy(asc(customers.name));
  },
);

export const createCustomer = createServerFn({ method: "POST" })
  .inputValidator(createCustomerInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(customers)
      .values({
        id: generateId(),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        address: data.address,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateCustomer = createServerFn({ method: "POST" })
  .inputValidator(updateCustomerInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(customers)
      .set({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        address: data.address,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, data.id))
      .returning();
    if (!updated) throw new Error("Customer not found");
    return updated;
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(customers).where(eq(customers.id, data.id));
    return { success: true };
  });

// ─── Room Types ──────────────────────────────────────────────────

export const listRoomTypes = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getServerDb();
    return db.select().from(roomTypes).orderBy(asc(roomTypes.name));
  },
);

export const listRoomTypesByItinerary = createServerFn({ method: "GET" })
  .inputValidator(itineraryParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    return db
      .select()
      .from(roomTypes)
      .where(eq(roomTypes.itineraryId, data.itineraryId))
      .orderBy(asc(roomTypes.name));
  });

export const createRoomType = createServerFn({ method: "POST" })
  .inputValidator(createRoomTypeInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(roomTypes)
      .values({
        id: generateId(),
        itineraryId: data.itineraryId,
        name: data.name.trim(),
        price: data.price,
        maxPerson: data.maxPerson,
        description: data.description,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateRoomType = createServerFn({ method: "POST" })
  .inputValidator(updateRoomTypeInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(roomTypes)
      .set({
        itineraryId: data.itineraryId,
        name: data.name.trim(),
        price: data.price,
        maxPerson: data.maxPerson,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(roomTypes.id, data.id))
      .returning();
    if (!updated) throw new Error("Room type not found");
    return updated;
  });

export const deleteRoomType = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(roomTypes).where(eq(roomTypes.id, data.id));
    return { success: true };
  });

// ─── Quotations ──────────────────────────────────────────────────

export const listQuotations = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getServerDb();
    return db.select().from(quotations).orderBy(desc(quotations.createdAt));
  },
);

export const getQuotation = createServerFn({ method: "GET" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const rows = await db
      .select()
      .from(quotations)
      .where(eq(quotations.id, data.id))
      .limit(1);
    if (!rows.length) throw new Error("Quotation not found");
    return rows[0];
  });

export const createQuotation = createServerFn({ method: "POST" })
  .inputValidator(createQuotationInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(quotations)
      .values({
        id: generateId(),
        customerId: data.customerId,
        destinationId: data.destinationId,
        itineraryId: data.itineraryId,
        roomTypeId: data.roomTypeId,
        totalPrice: data.totalPrice,
        status: data.status,
        notes: data.notes,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateQuotation = createServerFn({ method: "POST" })
  .inputValidator(updateQuotationInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(quotations)
      .set({
        customerId: data.customerId,
        destinationId: data.destinationId,
        itineraryId: data.itineraryId,
        roomTypeId: data.roomTypeId,
        totalPrice: data.totalPrice,
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(quotations.id, data.id))
      .returning();
    if (!updated) throw new Error("Quotation not found");
    return updated;
  });

export const deleteQuotation = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(quotations).where(eq(quotations.id, data.id));
    return { success: true };
  });

// ─── Quotation Features ────────────────────────────────────────────

export const listQuotationFeatures = createServerFn({ method: "GET" })
  .inputValidator(quotationParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    return db
      .select()
      .from(quotationFeatures)
      .where(eq(quotationFeatures.quotationId, data.quotationId))
      .orderBy(asc(quotationFeatures.featureName));
  });

export const createQuotationFeature = createServerFn({ method: "POST" })
  .inputValidator(createQuotationFeatureInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(quotationFeatures)
      .values({
        id: generateId(),
        quotationId: data.quotationId,
        featureName: data.featureName.trim(),
        description: data.description,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateQuotationFeature = createServerFn({ method: "POST" })
  .inputValidator(updateQuotationFeatureInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(quotationFeatures)
      .set({
        featureName: data.featureName.trim(),
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(quotationFeatures.id, data.id))
      .returning();
    if (!updated) throw new Error("Quotation feature not found");
    return updated;
  });

export const deleteQuotationFeature = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(quotationFeatures).where(eq(quotationFeatures.id, data.id));
    return { success: true };
  });

// ─── Do & Don'ts ──────────────────────────────────────────────────

export const listDoAndDonts = createServerFn({ method: "GET" })
  .inputValidator(destinationFilterSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const query = db.select().from(doAndDonts);
    if (data.destinationId) {
      query.where(eq(doAndDonts.destinationId, data.destinationId));
    }
    return query.orderBy(asc(doAndDonts.type));
  });

export const createDoAndDont = createServerFn({ method: "POST" })
  .inputValidator(createDoAndDontInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(doAndDonts)
      .values({
        id: generateId(),
        destinationId: data.destinationId,
        type: data.type,
        content: data.content.trim(),
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateDoAndDont = createServerFn({ method: "POST" })
  .inputValidator(updateDoAndDontInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(doAndDonts)
      .set({
        type: data.type,
        content: data.content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(doAndDonts.id, data.id))
      .returning();
    if (!updated) throw new Error("Do & Don't not found");
    return updated;
  });

export const deleteDoAndDont = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(doAndDonts).where(eq(doAndDonts.id, data.id));
    return { success: true };
  });

// ─── Email Templates ───────────────────────────────────────────────

export const listEmailTemplates = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = await getServerDb();
    return db.select().from(emailTemplates).orderBy(asc(emailTemplates.name));
  },
);

export const createEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator(createEmailTemplateInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const [created] = await db
      .insert(emailTemplates)
      .values({
        id: generateId(),
        name: data.name.trim(),
        subject: data.subject.trim(),
        body: data.body.trim(),
        isActive: data.isActive,
        updatedAt: now,
      })
      .returning();
    return created;
  });

export const updateEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator(updateEmailTemplateInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updated] = await db
      .update(emailTemplates)
      .set({
        name: data.name.trim(),
        subject: data.subject.trim(),
        body: data.body.trim(),
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.id, data.id))
      .returning();
    if (!updated) throw new Error("Email template not found");
    return updated;
  });

export const deleteEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator(idParamSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(emailTemplates).where(eq(emailTemplates.id, data.id));
    return { success: true };
  });
