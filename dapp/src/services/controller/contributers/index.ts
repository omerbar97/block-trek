import prisma from "@/lib/prisma";
import { sumAmountsOfContribution } from "@/utils/calculation";
import { Campaign, Contributer } from "@prisma/client";
import { getCampaignById } from "../campaign";


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

export async function getContributetrsFromDbByCampaignUuid(uuid: string): Promise<Contributer[]|null> {
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


interface CampaignContribution {
    campaigns: Campaign[];
    amounts: string[];
}

export async function getCampaignContributions(walletAddress: string): Promise<CampaignContribution> {
    try {
        // Fetch all contributions by the wallet address
        const contributions = await prisma.contributer.findMany({
            where: {
                walletAddress,
                isRefunded: false,
            },
            include: {
                campaign: true
            }
        });

        // Aggregate contributions per campaign
        const campaignContributions: CampaignContribution = {
            campaigns: [],
            amounts: []
        }

        const campaignMap = new Map<number, bigint>();
        const campaignIds: number[] = []
        contributions.forEach(contrib => {
            const { campaignId, amount } = contrib;
            if (campaignMap.has(campaignId)) {
                const currentAmount = campaignMap.get(campaignId)!;
                const totalAmount = currentAmount + BigInt(amount);
                campaignMap.set(campaignId, totalAmount);
            } else {
                campaignIds.push(campaignId)
                campaignMap.set(campaignId, BigInt(amount));
            }
        });

        for (let i = 0; i < campaignIds.length; i++) {
            const campaign = await getCampaignById(campaignIds[i])
            if (campaign === null) {
                throw new Error("failed to get campaigns to calculate contributers")
            }
            campaignContributions.campaigns.push(campaign)
            campaignContributions.amounts.push(campaignMap.get(campaign.id)!.toString())
        }
        return campaignContributions;
    } catch (error) {
        console.error("Failed to get campaign contributions: ", error);
        throw new Error("Failed to get campaign contributions");
    }
}