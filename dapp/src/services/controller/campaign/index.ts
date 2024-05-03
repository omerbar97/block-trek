import { useAxiosGet } from "@/hooks/useAxios.hook";
import { getBlockChainContract } from "@/services/crypto/contract";

export async function createCampaign(jsonData: any) {
    const service = await getBlockChainContract()
    const { ownerName, description, endDate, goalAmount, campaignType } = jsonData

    if (!ownerName || !description || !endDate || !goalAmount) {
        throw new Error("please make sure all the configuration is set when creating a new campaign")
    }
    const res = await service.createCampaign(ownerName, description, endDate, goalAmount, campaignType);
    return res
}

export async function getAllCampaigns() {
    return await useAxiosGet('/api/campaign')
}

export async function getCampaignById(capmaignId: string) {
    return await null
}