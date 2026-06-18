import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const itineraries = pgTable("itineraries", {
  id: text("id").primaryKey(),
  destination: text("destination").notNull(),
  title: text("title").notNull(),
  days: integer("days").notNull(),
  nights: integer("nights").notNull(),
  overview: text("overview"),
  price: integer("price"),
  dayDetails: json("days_details").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
