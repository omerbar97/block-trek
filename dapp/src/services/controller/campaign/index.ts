import { useAxiosGet } from "@/hooks/useAxios.hook";
import prisma from "@/lib/prisma";
import { IDisplayCampaign } from "@/types/campaign.interface";
import { Campaign, CampaignCategory, Contributer } from "@prisma/client";

export async function getAllCampaignsFromDb(name: string | null=null, category: CampaignCategory | null=null, experation: string | null=null) : Promise<Campaign[] | null> {
    try {
        if (category) {
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
                        category: category
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
                    category: category ?? ""
                },                
                orderBy: {
                    endAt: 'asc'
                }
            })
            return res
        } else {
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
                },                
                orderBy: {
                    endAt: 'asc'
                }
            })
            return res
        }
    }catch (e) {
        console.log("failed to get all campaigns ", e)
        return null;
    }
}

export async function saveCampaignToDb(campagin: Campaign): Promise<Boolean> {
    console.log("saving campaign in db for ", campagin.uuid, " and values ", campagin)
    try {
        await prisma.campaign.create({
            data: {
                ...campagin
            }
        })
        return true
    } catch (error) {
        console.log("failed to save campaign to db ", error)
        return false
    }
}

export async function updateCampaignInDb(uuid: string, values: Partial<Campaign>): Promise<Boolean> {
    console.log("updating campaign in db for ", uuid, " and values ", values)
    try {
        await prisma.campaign.update({
            where: {
                uuid: uuid
            }, 
            data: {
                ...values
            }
        })
        return true
    } catch (error) {
        console.log("failed to save campaign to db ", error)
        return false
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

export async function createCampaign(jsonData: any) {

    const { title, description, endDate, goalAmount, campaignType, walletAddress, uuid, campaignCategory } = jsonData

    if (!title || !description || !endDate || !goalAmount || !walletAddress) {
        throw new Error("please make sure all the configuration is set when creating a new campaign")
    }

    var campagin: Campaign = {
        contractAddress: '0',
        uuid: uuid as string,
        title: title,
        description: description,
        category: campaignCategory,
        image: '',
        video: 'video_url.mp4',
        goal: 1000, // Goal amount
        collected: 0, // Initial collected amount
        type: campaignType, // Campaign type
        createdAt: new Date(), // Current date and time
        endAt: new Date('2024-12-31'), // End date of the campaign
        isFinished: false, // Initial state
        isFailed: false, // Initial state
    }
    
    // await saveCampaignToDb()

}

export async function getAllCampaigns() {
    return await useAxiosGet('/api/campaign')
}
