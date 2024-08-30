CREATE TABLE IF NOT EXISTS "user_exports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_export_date" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_tier" varchar(20) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paypal_subscription_id" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_exports" ADD CONSTRAINT "user_exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
