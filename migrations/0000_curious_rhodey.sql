CREATE TYPE "public"."experience_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TYPE "public"."preferred_markets" AS ENUM('stocks', 'options', 'crypto', 'futures', 'forex');--> statement-breakpoint
CREATE TYPE "public"."risk_tolerance" AS ENUM('conservative', 'moderate', 'aggressive');--> statement-breakpoint
CREATE TYPE "public"."trading_style" AS ENUM('day_trader', 'swing_trader', 'position_trader', 'scalper');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"criteria" json NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"current_balance" numeric NOT NULL,
	"pnl" numeric DEFAULT '0',
	"rank" integer,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge_trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"type" text NOT NULL,
	"amount" numeric NOT NULL,
	"entry_price" numeric NOT NULL,
	"exit_price" numeric,
	"pnl" numeric,
	"status" text NOT NULL,
	"opened_at" timestamp DEFAULT now(),
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options_flow" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticker" text NOT NULL,
	"strike" integer NOT NULL,
	"expiry" timestamp NOT NULL,
	"volume" integer NOT NULL,
	"open_interest" integer NOT NULL,
	"type" text NOT NULL,
	"premium" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paper_trading_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"balance" numeric DEFAULT '100000' NOT NULL,
	"total_pnl" numeric DEFAULT '0',
	"daily_pnl" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"last_reset_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paper_trading_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"option_type" text NOT NULL,
	"quantity" integer NOT NULL,
	"entry_price" numeric NOT NULL,
	"strike_price" numeric NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"opened_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	"closing_price" numeric,
	"pnl" numeric DEFAULT '0',
	"risk_level" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"ticker" text,
	"analysis" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trading_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"initial_balance" numeric NOT NULL,
	"max_leverage" numeric DEFAULT '1',
	"allowed_instruments" json NOT NULL,
	"min_participants" integer DEFAULT 2,
	"max_participants" integer,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now(),
	"progress" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" varchar(255),
	"full_name" text,
	"bio" text,
	"avatar" text,
	"trading_style" "trading_style",
	"risk_tolerance" "risk_tolerance",
	"experience_level" "experience_level",
	"preferred_markets" json,
	"favorite_symbols" json,
	"trading_goals" text,
	"daily_profit_target" numeric,
	"max_drawdown" numeric,
	"created_at" timestamp DEFAULT now(),
	"total_pnl" numeric DEFAULT '0',
	"weekly_pnl" numeric DEFAULT '0',
	"win_rate" numeric DEFAULT '0',
	"trades_count" integer DEFAULT 0,
	"average_position_size" numeric DEFAULT '0',
	"average_holding_time" numeric DEFAULT '0',
	"best_trade" numeric DEFAULT '0',
	"worst_trade" numeric DEFAULT '0',
	"badges" json,
	"achievements" json,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_trading_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."trading_challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_trades" ADD CONSTRAINT "challenge_trades_participant_id_challenge_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."challenge_participants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paper_trading_accounts" ADD CONSTRAINT "paper_trading_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paper_trading_positions" ADD CONSTRAINT "paper_trading_positions_account_id_paper_trading_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."paper_trading_accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trading_challenges" ADD CONSTRAINT "trading_challenges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
