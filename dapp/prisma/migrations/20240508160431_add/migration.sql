-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "goal" SET DATA TYPE TEXT,
ALTER COLUMN "collected" SET DEFAULT '0',
ALTER COLUMN "collected" SET DATA TYPE TEXT;
