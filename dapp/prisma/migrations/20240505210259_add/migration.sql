/*
  Warnings:

  - Added the required column `endAt` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL;
