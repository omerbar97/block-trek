import { useAxiosGet } from "@/hooks/useAxios.hook";
import prisma from "@/lib/prisma";
import { getBlockChainContract } from "@/services/crypto/contract";
import { Campaign } from "@prisma/client";

export async function getAllCampaignsFromDb() : Promise<Campaign[] | null> {
    try {
        const res = await prisma.campaign.findMany()
        return res
    }catch (e) {
        console.log("failed to get all campaigns ", e)
        return null;
    }
}

export async function getCampaignById(id: number) : Promise<Campaign | null> {
    try {
        const res = await prisma.campaign.findFirst({
            where:{
                id: id
            }
        })
        return res
    } catch (e) {
        console.log("failed to get campaign by id ", e)
        return null
    }
}

export async function saveCampaignToDb(campaign: Campaign, addressOwner: string) {
    try{
        // Getting the owner of the wallet if it exits
        await prisma.campaign.create({
            data: {
                ownerId: addressOwner,

            }
        })
    }catch(e) {
        console.log("failed to save campagin to db ", e)
    }

}

export async function createCampaign(jsonData: any) {
    const service = await getBlockChainContract()
    const { ownerName, description, endDate, goalAmount, campaignType, walletAddress } = jsonData

    if (!ownerName || !description || !endDate || !goalAmount) {
        throw new Error("please make sure all the configuration is set when creating a new campaign")
    }
    const res = await service.createCampaign(ownerName, description, endDate, goalAmount, campaignType);
    
    return res
}

export async function getAllCampaigns() {
    return await useAxiosGet('/api/campaign')
}
