CREATE TABLE "hospital_appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"patient_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"reason" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hospital_enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hospital_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'patient' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "hospital_users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "hospital_appointments" ADD CONSTRAINT "hospital_appointments_user_id_hospital_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hospital_users"("id") ON DELETE no action ON UPDATE no action;
