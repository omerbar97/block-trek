// @ts-nocheck
import prisma from "@/lib/prisma";
import { IDisplayCampaign } from "@/types/campaign.interface";
import { Campaign, CampaignCategory, Contributer } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { getOwnerByWalletAddress } from "../owner";


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

export async function saveCampaignToDbUpdate(campaign: Campaign): Promise<Boolean> {
    console.log("saving campaign in db for ", campaign.uuid, " and values ", campaign)
    try {
        const existingCampaign = await prisma.campaign.findUnique({
            where: { uuid: campaign.uuid },
        });

        if (existingCampaign) {
            console.log("Campaign with this UUID already exists. Updating existing campaign.");
            await prisma.campaign.update({
                where: { uuid: campaign.uuid },
                data: {
                    title: campaign.title,
                    description: campaign.description,
                    category: campaign.category,
                    video: campaign.video,
                    image: campaign.image,
                    goal: campaign.goal,
                    type: campaign.type,
                    endAt: campaign.endAt,
                    createdAt: campaign.createdAt,
                    owner: {
                        connect: { id: campaign.ownerId }
                    },
                    isFinished: campaign.isFinished,
                },
            });
        } else {
            await prisma.campaign.create({
                data: {
                    title: campaign.title,
                    uuid: campaign.uuid,
                    description: campaign.description,
                    category: campaign.category,
                    video: campaign.video,
                    image: campaign.image,
                    goal: campaign.goal,
                    type: campaign.type,
                    endAt: campaign.endAt,
                    createdAt: campaign.createdAt,
                    owner: {
                        connect: { id: campaign.ownerId }
                    },
                    isFinished: campaign.isFinished,
                },
            })
        }
        return true
    } catch (error) {
        console.log("failed to save campaign to db ", error)
        return false
    }
}


export async function saveCampaignToDb(campagin: Campaign, ownerId: number): Promise<Boolean> {
    console.log("saving campaign in db for ", campagin.uuid, " and values ", campagin)
    try {
        await prisma.campaign.create({
            data: {
                ...campagin,
                owner: {
                    connect:{
                        id: ownerId
                    }
                }
            }
        })
        return true
    } catch (error) {
        console.log("failed to save campaign to db ", error)
        return false
    }
}

export async function updateCampaignInDbByUuid(uuid: string, values: Partial<Campaign>): Promise<Boolean> {
    console.log("updating campaign in db for ", uuid)
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


export async function getCampaignByUuid(uuid: string) : Promise<Campaign | null> {
    try {
        const res = await prisma.campaign.findFirst({
            where:{
                uuid: uuid
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
        const sortedContributers = (res.contributers ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const data = {
            campaign: res,
            owner: res?.owner,
            contributers: sortedContributers,
            rewards: res?.rewards ?? [],
        }
        return data
    } catch (e) {
        console.log("failed to get campaign by id ", e)
        return null
    }
}


export async function createCampaign(jsonData: any) {
    const { title, description, video, goal, type, category, endDate, walletAddress, image } = jsonData

    if (!title || !description || !endDate || !goal || !walletAddress || !type || !category) {
        throw new Error("please make sure all the configuration is set when creating a new campaign")
    }

    const owner = await getOwnerByWalletAddress(walletAddress)
    if(!owner) {
        throw new Error("failed to get owner for wallet address: " + walletAddress)
    }

    const uuid = uuidv4()
    var campagin: Partial<Campaign> = {
        uuid: uuid as string,
        title: title,
        description: description,
        category: category as CampaignCategory,
        image: image ?? "",
        video: video ?? "",
        goal: goal,
        type: type,
        endAt: new Date(endDate),
    }

    await saveCampaignToDb(campagin as Campaign, Number(owner.id))
    return uuid
}


export async function deleteCampaignFromDb(campaignUuid: string) {
    console.log("deleting campaign: " + campaignUuid)
    try {
        await prisma.campaign.delete({
            where:{
                uuid: campaignUuid
            }
        })
        return true
    } catch (error) {
        console.log("failed to delete campaign from db ", error)
        return false
    }
}

