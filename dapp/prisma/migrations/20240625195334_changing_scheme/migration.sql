/*
  Warnings:

  - You are about to drop the column `contractAddress` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_id` on the `Contributer` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_address` on the `Contributer` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_id` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `min_amount` on the `Reward` table. All the data in the column will be lost.
  - Added the required column `campaignId` to the `Contributer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Contributer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minAmount` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contributer" DROP CONSTRAINT "Contributer_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_campaign_id_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "contractAddress";

-- AlterTable
ALTER TABLE "Contributer" DROP COLUMN "campaign_id",
DROP COLUMN "wallet_address",
ADD COLUMN     "campaignId" INTEGER NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "campaign_id",
DROP COLUMN "min_amount",
ADD COLUMN     "campaignId" INTEGER NOT NULL,
ADD COLUMN     "minAmount" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Contributer" ADD CONSTRAINT "Contributer_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
