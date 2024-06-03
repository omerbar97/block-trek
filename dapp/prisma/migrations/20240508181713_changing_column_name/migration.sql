/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CampaignCategory" ADD VALUE 'NO_CATEGORY';

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_owner_id_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "owner_id",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
