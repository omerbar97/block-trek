import prisma from "@/lib/prisma";
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