CREATE TABLE "receipts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "receipts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"attendee_id" integer NOT NULL,
	"date" date NOT NULL,
	"amount" integer NOT NULL,
	"method" text NOT NULL,
	"method_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "receipts_amount_check" CHECK ("receipts"."amount" >= 1)
);
--> statement-breakpoint
ALTER TABLE "tour_attendees" DROP CONSTRAINT "tour_attendees_received_amount_check";--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_attendee_id_tour_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."tour_attendees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_attendees" DROP COLUMN "received_amount";