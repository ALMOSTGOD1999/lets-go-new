import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { destinations } from "./destinations";
import { itineraries } from "./itineraries";
import { roomTypes } from "./room-types";

export const quotations = pgTable("quotations", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  destinationId: text("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  itineraryId: text("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  roomTypeId: text("room_type_id")
    .notNull()
    .references(() => roomTypes.id, { onDelete: "cascade" }),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("draft"),
  pdfPath: text("pdf_path"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
