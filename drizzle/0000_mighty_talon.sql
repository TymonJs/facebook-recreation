CREATE TABLE IF NOT EXISTS "chat_participants" (
	"chat_id" integer NOT NULL,
	"login" text NOT NULL,
	CONSTRAINT "chat_participants_chat_id_login_pk" PRIMARY KEY("chat_id","login")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"by_login" text NOT NULL,
	"text" text NOT NULL,
	"comment_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "friend_requests" (
	"from_login" text NOT NULL,
	"to_login" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friend_requests_from_login_to_login_pk" PRIMARY KEY("from_login","to_login")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "friendships" (
	"user_a" text NOT NULL,
	"user_b" text NOT NULL,
	CONSTRAINT "friendships_user_a_user_b_pk" PRIMARY KEY("user_a","user_b")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"by_login" text NOT NULL,
	"text" text NOT NULL,
	"message_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_likes" (
	"post_id" integer NOT NULL,
	"by_login" text NOT NULL,
	CONSTRAINT "post_likes_post_id_by_login_pk" PRIMARY KEY("post_id","by_login")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_login" text NOT NULL,
	"post_index" integer NOT NULL,
	"body" text NOT NULL,
	"created_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"login" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lastname" text NOT NULL,
	"gender" text,
	"birth_day" integer,
	"birth_month" integer,
	"birth_year" integer,
	"salt" text NOT NULL,
	"verifier" text NOT NULL,
	"friend_privacy" text,
	"desc" text,
	"pfp" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_login_users_login_fk" FOREIGN KEY ("login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_by_login_users_login_fk" FOREIGN KEY ("by_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_from_login_users_login_fk" FOREIGN KEY ("from_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_login_users_login_fk" FOREIGN KEY ("to_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_a_users_login_fk" FOREIGN KEY ("user_a") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_b_users_login_fk" FOREIGN KEY ("user_b") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_by_login_users_login_fk" FOREIGN KEY ("by_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_by_login_users_login_fk" FOREIGN KEY ("by_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_login_users_login_fk" FOREIGN KEY ("user_login") REFERENCES "public"."users"("login") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
