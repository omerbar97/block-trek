/*
  Warnings:

  - Changed the type of `campaign_id` on the `Contributer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `campaign_id` on the `Reward` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Contributer" DROP CONSTRAINT "Contributer_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_campaign_id_fkey";

-- AlterTable
ALTER TABLE "Contributer" DROP COLUMN "campaign_id",
ADD COLUMN     "campaign_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "campaign_id",
ADD COLUMN     "campaign_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contributer" ADD CONSTRAINT "Contributer_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
