import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { itineraries } from "./itineraries";

export const roomTypes = pgTable("room_types", {
  id: text("id").primaryKey(),
  itineraryId: text("itinerary_id")
    .notNull()
    .references(() => itineraries.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  maxPerson: integer("max_person").default(2),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
