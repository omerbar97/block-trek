import prisma from "@/lib/prisma";
import { ContributerBlockChainScanIndex } from "@prisma/client";

export async function getContributionScanIndex(campaignId: number): Promise<ContributerBlockChainScanIndex|null> {
    console.log("getting scan index from db for campaign id " + campaignId)
    try {
        const value = await prisma.contributerBlockChainScanIndex.findUnique({
            where: {
                campaignId: campaignId,
            }
        })
        return value;
    } catch (error) {
        console.error("Failed to get scan index from db: ", error);
        return null
    }
}

export async function updateContributionScanIndex(campaignId: number, index: number): Promise<boolean> {
    console.log("saving scan index to db for campaign id " + campaignId)
    try {
        await prisma.contributerBlockChainScanIndex.upsert({
            where: {
                campaignId: campaignId,
            },
            create: {
                campaignId: campaignId,
                value: index
            },
            update: {
                value: index,
                updateDate: new Date(),
            }
        })
        return true;
    } catch (error) {
        console.error("Failed to saving scan index to db: ", error);
        return false
    }
}