import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { quotations } from "./quotations";

export const quotationFeatures = pgTable("quotation_features", {
  id: text("id").primaryKey(),
  quotationId: text("quotation_id")
    .notNull()
    .references(() => quotations.id, { onDelete: "cascade" }),
  featureName: text("feature_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
