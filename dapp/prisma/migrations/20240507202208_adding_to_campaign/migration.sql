/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Campaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CampaignCategory" AS ENUM ('SOCIAL_CAUSES', 'HEALTH_AND_WELLNESS', 'TECHNOLOGY_AND_INNOVATION', 'ARTS_AND_CULTURE', 'COMMUNITY_DEVELOPMENT', 'EDUCATION_AND_LEARNING', 'HUMAN_RIGHTS', 'EMERGENCY_RELIEF', 'SCIENCE_AND_RESEARCH', 'SPORTS_AND_RECREATION', 'BUSINESS_AND_ENTREPRENEURSHIP', 'FOOD_AND_AGRICULTURE', 'ELDERLY_CARE', 'TECH_FOR_GOOD', 'ENVIRONMENTAL_SUSTAINABILITY');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "CampaignCategory" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_uuid_key" ON "Campaign"("uuid");
