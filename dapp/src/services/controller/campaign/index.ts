import { useAxiosGet } from "@/hooks/useAxios.hook";
import prisma from "@/lib/prisma";
import { getBlockChainContract } from "@/services/crypto/contract";
import { IDisplayCampaign } from "@/types/campaign.interface";
import { Campaign, Contributer } from "@prisma/client";

export async function getAllCampaignsFromDb(name: string | null=null, category: string | null=null, experation: string | null=null) : Promise<Campaign[] | null> {
    try {
        if (experation !== null && experation !== "") {
            const date = new Date(experation)
            const res = await prisma.campaign.findMany({
                where: {
                    title: {
                        contains: name ?? ""
                    },
                    endAt: {
                        lt: date
                    },
                    category: {
                        contains: category ?? ""
                    }
                },
                orderBy: {
                    endAt: 'asc'
                }
            })
            return res
        }
        const res = await prisma.campaign.findMany({
            where: {
                title: {
                    contains: name ?? ""
                },
                category: {
                    contains: category ?? ""
                }
            },                
            orderBy: {
                endAt: 'asc'
            }
        })
        return res
    }catch (e) {
        console.log("failed to get all campaigns ", e)
        return null;
    }
}

export async function getAllOwnerDonationFromDbByWalletAddress(walletAddress: string): Promise<Contributer[] | null> {
    try {
        const res = await prisma.contributer.findMany({
            where: {
                walletAddress: walletAddress,
            }, 
            orderBy: {
                date: 'desc'
            }
        })
        return res
    } catch (error) {
        console.log("failed to get owner donation ", error)
        return null
    }
}

export async function getAllCampaignsFromDbForOwnerByWalletAddress(walletAddress: string): Promise<Campaign[] | null> {
    try{
        const res = await prisma.campaign.findMany({
            where: {
                owner: {
                    walletAddress: walletAddress,
                }
            }
        })
        return res
    } catch (e) {
        console.log("failed to retreive owner campaign ", e)
        return null
    }
}

export async function getAllCampaignsFromDbWithFilter(name: string, category: string, experation: string) : Promise<Campaign[] | null> {
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

export async function getCampaignByIdWithAllData(id: number) : Promise<IDisplayCampaign | null> {
    try {
        const res = await prisma.campaign.findFirst({
            where:{
                id: id
            },
            include: {
                rewards: true,
                contributers: true,
                owner: true,
            }
        })
        if (!res) {
            return null;
        }
        const data = {
            campaign: res,
            owner: res?.owner,
            contributers: res?.contributers ?? [],
            rewards: res?.rewards ?? [],
        }
        return data
    } catch (e) {
        console.log("failed to get campaign by id ", e)
        return null
    }
}

// export async function saveCampaignToDb(campaign: Campaign, addressOwner: string) {
//     try{
//         // Getting the owner of the wallet if it exits
//         await prisma.campaign.create({
//             data: {
//                 ownerId: addressOwner,
//             }
//         })
//     }catch(e) {
//         console.log("failed to save campagin to db ", e)
//     }

// }

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
