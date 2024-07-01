import prisma from "@/lib/prisma";

export async function getTotalNumberOfCampaignsFromDb(): Promise<number> {
    try {
        const totalCount = await prisma.campaign.count();
        return totalCount;
    } catch (error) {
        console.error("Failed to get total number of campaigns: ", error);
        return -1;
    }
}


export async function getNumberOfCampaignsThatWereSuccssfullyFromDb(): Promise<number> {
    try {
        const count = await prisma.campaign.count({
            where: {
                isFinished: true,
                isOwnerRetrievedDonations: true
            }
        });
        return count;
    } catch (error) {
        console.error("Failed to get total number of campaigns: ", error);
        return -1;
    }
}

export async function getNumberOfCampaignsThatFailedFromDb(): Promise<number> {
    try {
        const count = await prisma.campaign.count({
            where: {
                isFailed: true,
            }
        });
        return count;
    } catch (error) {
        console.error("Failed to get total number of campaigns: ", error);
        return -1;
    }
}

export async function getNumberOfCampaignsThatOnGoingFromDb(): Promise<number> {
    try {
        const count = await prisma.campaign.count({
            where: {
                isFailed: false,
                isFinished: false,
                isOwnerRetrievedDonations: false
            }
        });
        return count;
    } catch (error) {
        console.error("Failed to get total number of campaigns: ", error);
        return -1;
    }
}