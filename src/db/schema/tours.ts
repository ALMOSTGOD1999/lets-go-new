import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";

export const tours = pgTable(
  "tours",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text(),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    check(
      "tours_date_range_check",
      sql`${table.endDate} >= ${table.startDate}`,
    ),
  ],
);

export const tourAttendees = pgTable(
  "tour_attendees",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tourId: integer("tour_id")
      .notNull()
      .references(() => tours.id),
    clientId: integer("client_id")
      .notNull()
      .references(() => clients.id),
    adultCount: integer("adult_count").default(1).notNull(),
    childCount: integer("child_count").default(0).notNull(),
    adultCost: integer("adult_cost").default(0).notNull(),
    childCost: integer("child_cost").default(0).notNull(),
    adultGstPercent: integer("adult_gst_percent").default(5).notNull(),
    childGstPercent: integer("child_gst_percent").default(5).notNull(),
    discountAmount: integer("discount_amount").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    check("tour_attendees_adult_count_check", sql`${table.adultCount} >= 1`),
    check("tour_attendees_child_count_check", sql`${table.childCount} >= 0`),
    check("tour_attendees_adult_cost_check", sql`${table.adultCost} >= 0`),
    check("tour_attendees_child_cost_check", sql`${table.childCost} >= 0`),
    check(
      "tour_attendees_adult_gst_percent_check",
      sql`${table.adultGstPercent} >= 0 and ${table.adultGstPercent} <= 100`,
    ),
    check(
      "tour_attendees_child_gst_percent_check",
      sql`${table.childGstPercent} >= 0 and ${table.childGstPercent} <= 100`,
    ),
    check(
      "tour_attendees_discount_amount_check",
      sql`${table.discountAmount} >= 0`,
    ),
    uniqueIndex("tour_attendees_tour_client_unique").on(
      table.tourId,
      table.clientId,
    ),
  ],
);

export const receipts = pgTable(
  "receipts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attendeeId: integer("attendee_id")
      .notNull()
      .references(() => tourAttendees.id),
    date: date("date", { mode: "date" }).notNull(),
    amount: integer("amount").notNull(),
    method: text("method").notNull(),
    methodInfo: text("method_info"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => [check("receipts_amount_check", sql`${table.amount} >= 1`)],
);

export const vouchers = pgTable(
  "vouchers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    attendeeId: integer("attendee_id")
      .notNull()
      .references(() => tourAttendees.id),
    bookingId: text("booking_id"),
    date: date("date", { mode: "date" }).notNull(),
    serviceType: text("service_type").notNull(),
    propertyName: text("property_name").notNull(),
    address: text(),
    checkinDate: date("checkin_date", { mode: "date" }),
    checkoutDate: date("checkout_date", { mode: "date" }),
    subBookingType: text("sub_booking_type"),
    meal: text(),
    payment: text(),
    confirmedBy: text("confirmed_by"),
    serviceContact: text("service_contact"),
    confirmerContact: text("confirmer_contact"),
    voucherType: text("voucher_type").notNull().default("hotel"),
    remarks: text("remarks"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "vouchers_checkout_date_check",
      sql`${table.checkoutDate} is null or ${table.checkinDate} is null or ${table.checkoutDate} >= ${table.checkinDate}`,
    ),
  ],
);
