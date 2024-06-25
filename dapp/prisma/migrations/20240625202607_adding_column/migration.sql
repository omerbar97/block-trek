/*
  Warnings:

  - You are about to drop the column `date` on the `ContributerBlockChainScanIndex` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContributerBlockChainScanIndex" DROP COLUMN "date",
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
