-- CreateTable
CREATE TABLE "ContributerBlockChainScanIndex" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributerBlockChainScanIndex_pkey" PRIMARY KEY ("id")
);
