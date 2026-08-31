-- Card screens show brand and last digits. Stored on CREDIT_CARD accounts
-- instead of creating a separate cards table.

ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "brand" TEXT;
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "last_four" VARCHAR(4);
