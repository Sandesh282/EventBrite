CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'read', 'replied');
--> statement-breakpoint
CREATE TABLE "contact_enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service" text,
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
