import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNull, like, sql } from "drizzle-orm";
import { z } from "zod";

import { clients, receipts, tourAttendees, tours, vouchers } from "#/db/schema";
import {
  type ReceiptMethod,
  receiptFormSchema,
  voucherFormSchema,
} from "#/features/bookings/data/schema";
import { calculateAttendeeBilling } from "#/features/tour-attendees/lib/calculations";

const attendeeSchema = z.object({ attendeeId: z.number().int().positive() });
const receiptTotalSql = sql<number>`coalesce((select sum(${receipts.amount}) from ${receipts} where ${receipts.attendeeId} = ${tourAttendees.id}), 0)::int`;

export const getBookingContext = createServerFn({ method: "GET" })
  .inputValidator(attendeeSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
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
        clientName: clients.name,
        clientEmail: clients.email,
        clientPhone: clients.phone,
        clientAddress: clients.address,
        tourName: tours.name,
        tourStartDate: tours.startDate,
        tourEndDate: tours.endDate,
        receivedAmount: receiptTotalSql,
      })
      .from(tourAttendees)
      .innerJoin(clients, eq(clients.id, tourAttendees.clientId))
      .innerJoin(tours, eq(tours.id, tourAttendees.tourId))
      .where(
        and(
          eq(tourAttendees.id, data.attendeeId),
          isNull(tourAttendees.deletedAt),
          isNull(clients.deletedAt),
          isNull(tours.deletedAt),
        ),
      )
      .limit(1);
    if (!row) throw new Error("Booking not found");
    return { ...row, ...calculateAttendeeBilling(row) };
  });

export const listVouchers = createServerFn({ method: "GET" })
  .inputValidator(attendeeSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    return db
      .select()
      .from(vouchers)
      .where(eq(vouchers.attendeeId, data.attendeeId))
      .orderBy(desc(vouchers.date), desc(vouchers.id));
  });

export const listReceipts = createServerFn({ method: "GET" })
  .inputValidator(attendeeSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const rows = await db
      .select()
      .from(receipts)
      .where(eq(receipts.attendeeId, data.attendeeId))
      .orderBy(desc(receipts.date), desc(receipts.id));
    return rows.map((row) => ({
      ...row,
      method: row.method as ReceiptMethod,
    }));
  });

export const createReceipt = createServerFn({ method: "POST" })
  .inputValidator(receiptFormSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .insert(receipts)
      .values({
        attendeeId: data.attendeeId,
        date: new Date(data.date),
        amount: data.amount,
        method: data.method,
        methodInfo: normalizeText(data.methodInfo),
        updatedAt: new Date(),
      })
      .returning();
    return row;
  });

export const updateReceipt = createServerFn({ method: "POST" })
  .inputValidator(
    receiptFormSchema.safeExtend({ id: z.number().int().positive() }),
  )
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .update(receipts)
      .set({
        date: new Date(data.date),
        amount: data.amount,
        method: data.method,
        methodInfo: normalizeText(data.methodInfo),
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, data.id))
      .returning();
    if (!row) throw new Error("Receipt not found");
    return row;
  });

export const deleteReceipt = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(receipts).where(eq(receipts.id, data.id));
    return { ok: true };
  });

export const createVoucher = createServerFn({ method: "POST" })
  .inputValidator(voucherFormSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const bookingId =
      normalizeBookingId(data.bookingId) ??
      (await generateBookingId(db, data.date));
    const [row] = await db
      .insert(vouchers)
      .values({
        attendeeId: data.attendeeId,
        voucherType: data.voucherType ?? "hotel",
        bookingId,
        date: new Date(data.date),
        serviceType: data.serviceType.trim(),
        propertyName: data.propertyName.trim(),
        address: normalizeText(data.address),
        checkinDate: normalizeDate(data.checkinDate),
        checkoutDate: normalizeDate(data.checkoutDate),
        subBookingType: normalizeText(data.subBookingType),
        meal: normalizeText(data.meal),
        payment: normalizeText(data.payment),
        confirmedBy: normalizeText(data.confirmedBy),
        serviceContact: normalizeText(data.serviceContact),
        confirmerContact: normalizeText(data.confirmerContact),
        remarks: normalizeText(data.remarks),
        updatedAt: new Date(),
      })
      .returning();
    return row;
  });

export const updateVoucher = createServerFn({ method: "POST" })
  .inputValidator(
    voucherFormSchema.safeExtend({ id: z.number().int().positive() }),
  )
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [row] = await db
      .update(vouchers)
      .set({
        voucherType: data.voucherType ?? "hotel",
        bookingId: normalizeBookingId(data.bookingId),
        date: new Date(data.date),
        serviceType: data.serviceType.trim(),
        propertyName: data.propertyName.trim(),
        address: normalizeText(data.address),
        checkinDate: normalizeDate(data.checkinDate),
        checkoutDate: normalizeDate(data.checkoutDate),
        subBookingType: normalizeText(data.subBookingType),
        meal: normalizeText(data.meal),
        payment: normalizeText(data.payment),
        confirmedBy: normalizeText(data.confirmedBy),
        serviceContact: normalizeText(data.serviceContact),
        confirmerContact: normalizeText(data.confirmerContact),
        remarks: normalizeText(data.remarks),
        updatedAt: new Date(),
      })
      .where(eq(vouchers.id, data.id))
      .returning();
    if (!row) throw new Error("Voucher not found");
    return row;
  });

export const deleteVoucher = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db.delete(vouchers).where(eq(vouchers.id, data.id));
    return { ok: true };
  });

async function generateBookingId(
  db: Awaited<ReturnType<typeof getServerDb>>,
  date: string,
) {
  const prefix = `VCH-${date.replaceAll("-", "")}-`;
  const [row] = await db
    .select({ bookingId: vouchers.bookingId })
    .from(vouchers)
    .where(like(vouchers.bookingId, `${prefix}%`))
    .orderBy(desc(vouchers.bookingId))
    .limit(1);
  const current = row?.bookingId?.slice(prefix.length);
  const next = current ? Number(current) + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
function normalizeDate(value?: string | null) {
  return value?.trim() ? new Date(value) : null;
}
function normalizeBookingId(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function getServerDb() {
  const { getDb } = await import("#/db/index.server");
  return getDb();
}
