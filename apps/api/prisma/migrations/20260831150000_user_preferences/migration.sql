-- CreateEnum
CREATE TYPE "theme_preference" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "theme" "theme_preference" NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN "hide_balances" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "period_start_day" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_bills" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_invoices" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_budgets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notify_unusual" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_goals" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notify_low_balance" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "users"
ADD CONSTRAINT "users_period_start_day_check" CHECK ("period_start_day" >= 1 AND "period_start_day" <= 28);
