ALTER TABLE "tour_attendees" ADD COLUMN "adult_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "child_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "adult_cost" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "child_cost" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "adult_gst_percent" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "child_gst_percent" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "discount_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD COLUMN "received_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_adult_count_check" CHECK ("tour_attendees"."adult_count" >= 1);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_child_count_check" CHECK ("tour_attendees"."child_count" >= 0);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_adult_cost_check" CHECK ("tour_attendees"."adult_cost" >= 0);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_child_cost_check" CHECK ("tour_attendees"."child_cost" >= 0);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_adult_gst_percent_check" CHECK ("tour_attendees"."adult_gst_percent" >= 0 and "tour_attendees"."adult_gst_percent" <= 100);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_child_gst_percent_check" CHECK ("tour_attendees"."child_gst_percent" >= 0 and "tour_attendees"."child_gst_percent" <= 100);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_discount_amount_check" CHECK ("tour_attendees"."discount_amount" >= 0);--> statement-breakpoint
ALTER TABLE "tour_attendees" ADD CONSTRAINT "tour_attendees_received_amount_check" CHECK ("tour_attendees"."received_amount" >= 0);