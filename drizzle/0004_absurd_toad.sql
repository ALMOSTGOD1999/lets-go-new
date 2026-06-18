CREATE TABLE "vouchers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vouchers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"attendee_id" integer NOT NULL,
	"booking_id" text,
	"date" date NOT NULL,
	"service_type" text NOT NULL,
	"property_name" text NOT NULL,
	"address" text,
	"checkin_date" date,
	"checkout_date" date,
	"sub_booking_type" text,
	"meal" text,
	"payment" text,
	"confirmed_by" text,
	"service_contact" text,
	"confirmer_contact" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vouchers_checkout_date_check" CHECK ("vouchers"."checkout_date" is null or "vouchers"."checkin_date" is null or "vouchers"."checkout_date" >= "vouchers"."checkin_date")
);
--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_attendee_id_tour_attendees_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."tour_attendees"("id") ON DELETE no action ON UPDATE no action;