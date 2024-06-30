import prisma from "@/lib/prisma";
import { sumAmountsOfContribution } from "@/utils/calculation";
import { Contributer } from "@prisma/client";


export async function saveContributersToDb(contributer: Contributer): Promise<boolean> {
    console.log("saving contributer to db")
    try {
        if (!contributer.campaignId || !contributer.walletAddress || !contributer.amount) {
            throw new Error("Missing required fields");
        }
        await prisma.contributer.create({
            data: {
                ...contributer,
                date: new Date(),
            }
        });
        return true;
    } catch (error) {
        console.error("Failed to save contributer: ", error);
        return false
    }
}

export async function getContributetrsByCampaignUuid(uuid: string): Promise<Contributer[]|null> {
    console.log("getting all contributers for campaign " + uuid)
    try {
        const campaignId = await prisma.campaign.findFirst({
            where: {
                uuid: uuid,
            },
            select: {
                id: true,
            }
        })
        if (campaignId === null) throw new Error("campaign uuid doesn't exists")
        const res = await prisma.contributer.findMany({
            where: {
                campaignId: campaignId.id
            }
        })
        return res
    } catch (error) {
        console.log("failed to get contributers for campaign uuid: " + uuid + " " + error)
        return null
    }
}

export async function deleteAllContributersForCampaignByCampaignId(id: number): Promise<boolean> {
    console.log("deleting all contributers for campaign id: " + id)
    try {
        await prisma.contributer.deleteMany({
            where: {
                campaignId: id,
            },
        })
        return true
    } catch (error) {
        console.log("failed to delete all contributers for campaign id: " + id + " " + error)
        return false
    }
}

export async function updateAllContributersToBeRefundedByCampaignIdAndWallet(campaignId: number, walletAddress:string): Promise<boolean> {
    console.log("setting all contribution for campaign id: " + campaignId + " and walletAddress: " + walletAddress + " to refunded")
    try {
        await prisma.contributer.updateMany({
            where: {
                campaignId: campaignId,
                walletAddress: walletAddress,
            },
            data: {
                isRefunded: true
            }
        })
        return true
    } catch (error) {
        console.log("failed to set all contribution for campaign id: " + campaignId + " and walletAddress: " + walletAddress + " to refunded. error: " + " " + error)
        return false
    }
}

export async function getSumOfContributerByCampaignIdAndWalletAddress(campaignId: number, walletAddress:string): Promise<bigint> {
    console.log("getting contribution for campaign id: " + campaignId + " and walletAddress: " + walletAddress + " to refunded")
    try {
        const result = await prisma.contributer.findMany({
            where: {
                campaignId: campaignId,
                walletAddress: walletAddress,
                isRefunded: false
            },
        })
        return sumAmountsOfContribution(result)
    } catch (error) {
        console.log("failed to set all contribution for campaign id: " + campaignId + " and walletAddress: " + walletAddress + " to refunded. error: " + " " + error)
        return BigInt(0)
    }
}