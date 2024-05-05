-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('Reward', 'Donation');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "filledForm" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "video" TEXT,
    "goal" INTEGER NOT NULL,
    "collected" INTEGER NOT NULL,
    "type" "CampaignType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributer" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "wallet_address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "Contributer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "min_amount" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "image" TEXT,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_contractAddress_key" ON "Campaign"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_walletAddress_key" ON "Owner"("walletAddress");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributer" ADD CONSTRAINT "Contributer_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
