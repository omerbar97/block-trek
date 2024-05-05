-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "isFailed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false;
