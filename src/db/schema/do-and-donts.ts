import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { destinations } from "./destinations";

export const doAndDonts = pgTable("do_and_donts", {
  id: text("id").primaryKey(),
  destinationId: text("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
