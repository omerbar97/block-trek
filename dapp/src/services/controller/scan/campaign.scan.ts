import { deleteCampaignFromDb, getAllCampaignsFromDb, getCampaignByUuid, saveCampaignToDbUpdate, updateCampaignInDbByUuid } from "../campaign";
import { Campaign, CampaignCategory, CampaignType, Contributer } from "@prisma/client";
import { getOwnerByWalletAddress } from "../owner";
import { CampaignFromBlockchain, ContributionsFromBlockchain, getCampaignByUuidFromBlockchain, getCampaignContributionByUuid, getDeployedCampaignsUuidFromBlockchain } from "../crypto";
import { deleteAllContributersForCampaignByCampaignId, getContributetrsFromDbByCampaignUuid, getSumOfContributerByCampaignIdAndWalletAddress, saveContributersToDb, updateAllContributersToBeRefundedByCampaignIdAndWallet } from "../contributers";
import { getUnixTime } from "date-fns";
import { addAllContributersFromBlockchainToDb, addContributionFromBlockchainToDbWithChecks } from "./contribution.scan";

export const bigintToString = (value: bigint): string => {
    return value.toString();
};

async function handleCampaignNotInDb(campaignFromBC: CampaignFromBlockchain) {
    const owner = await getOwnerByWalletAddress(campaignFromBC.owner);
    if (!owner) {
        throw new Error("the owner doesn't exsits so not uploading this campaign")
    }
    let goal = bigintToString(campaignFromBC.goalAmount)
    const data = {
        title: campaignFromBC.campaignName,
        uuid: campaignFromBC.uuid,
        description: campaignFromBC.campaignDescription,
        category: CampaignCategory.NO_CATEGORY,
        video: "",
        image: "",
        goal: goal,
        type: CampaignType.Donation,
        endAt: new Date(campaignFromBC.endDate*1000),
        createdAt: new Date(campaignFromBC.startDate*1000),
        ownerId: owner.id,
        isFinished: campaignFromBC.isFinished,
    }
    const flag = await saveCampaignToDbUpdate(data as Campaign)
    if (!flag) return

    // Saving the contributers
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignFromBC.uuid)

    // getting all the data about contributers we have
    const contributersFromDb = await getContributetrsFromDbByCampaignUuid(campaignFromBC.uuid)
    const campaign = await getCampaignByUuid(campaignFromBC.uuid)
    if (campaign === null) {
        throw new Error("failed to get campaign from database to get the campain id for campaign uuid: " + campaignFromBC.uuid)
    }
    if (contributersFromDb === null) {
        throw new Error("failed to get contributers from database for campain id: " + campaign.id)
    }
    await updateContributionInDbForCampaign(campaign.id, contributersFromDb, contributersFromBlockchain)
}

async function updateContributionInDbForCampaign(campaignId: number, contributersFromDb: Contributer[], contributersJson: ContributionsFromBlockchain) {
    console.log("try to updateContributionInDbForCampaign for campaign id: " + campaignId)
    try {
        if (contributersFromDb.length === 0) {
            // adding all the contributers from blockchain
            await addAllContributersFromBlockchainToDb(campaignId, contributersJson)
            }
        else {
            await addContributionFromBlockchainToDbWithChecks(campaignId, contributersJson, contributersFromDb)
        }
    } catch (error) {
        console.log("failed to updateContributionInDbForCampaign for campaign id: " + campaignId + " " + error)
    }
}

async function updateCampaignDetailsInDb(campaignFromDb: Campaign, campaignFromBC: CampaignFromBlockchain) {
    console.log("updating campaign details from blockchain for campaign id: " + campaignFromDb.id)
    try {
        const data = {
            updatedAt: new Date(),
            collected: bigintToString(campaignFromBC.totalContributions),
            isFinished: campaignFromBC.totalContributions >= campaignFromBC.goalAmount,
            isFailed: getUnixTime(new Date()) > campaignFromBC.endDate && campaignFromBC.totalContributions < campaignFromBC.goalAmount,
            isOwnerRetrievedDonations: campaignFromBC.isOwnerRetrievedDonations,
        }
        await updateCampaignInDbByUuid(campaignFromDb.uuid, data)
    } catch (error) {
        console.log("failed to update campaign details from blockchain for campaign id: " + campaignFromDb.id + " " + error)
    }
}

export async function handleCampaignsAndInsertToDb(uuid: string) {
    const campaignFromBC = await getCampaignByUuidFromBlockchain(uuid)
    const campaignFromDb = await getCampaignByUuid(uuid)
    if(campaignFromDb === null) {
        await handleCampaignNotInDb(campaignFromBC)
        return
    }

    // updating the information for the campaign
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignFromBC.uuid)
    const contributionFromDb = await getContributetrsFromDbByCampaignUuid(campaignFromDb.uuid)
    if (contributionFromDb === null) {
        throw new Error("failed to get campaign from db")
    }
    // we will update the campaign state only in case the owner didn't retreived their funding
    if (!campaignFromBC.isOwnerRetrievedDonations) {
        await updateContributionInDbForCampaign(campaignFromDb.id, contributionFromDb, contributersFromBlockchain)
        await updateCampaignDetailsInDb(campaignFromDb, campaignFromBC)
    }
}

async function syncCampaignsBetweenBlockchainAndDb(campaignsFromDb: Campaign[], campaignsUuidFromBC: string[]) {
    try {
        // Check for campaigns in blockchain but not in the database
        const campaignsNotInDb = campaignsFromDb.filter(campaign => !campaignsUuidFromBC.some(uuid => uuid === campaign.uuid));
        // deleting all the campaignsNotInDb
        for(let i = 0; i < campaignsNotInDb.length; i++) {
            await deleteAllContributersForCampaignByCampaignId(campaignsNotInDb[i].id)
            await deleteCampaignFromDb(campaignsNotInDb[i].uuid)
        }
    } catch (error) {
        console.error("Error synchronizing campaigns:", error);
    }
}

export async function scanCampaignsAndInsertToDb() {
    const campaignsUuidFromBC = await getDeployedCampaignsUuidFromBlockchain() as string[]
    for(let i = 0; i < campaignsUuidFromBC.length; i++) {
        await handleCampaignsAndInsertToDb(campaignsUuidFromBC[i])
    }
    // checking if all the campaigns are sync with the database
    const campaignsFromDb = await getAllCampaignsFromDb()
    if (!campaignsFromDb) throw new Error("failed to get campaigns from db to sync campaign")
    await syncCampaignsBetweenBlockchainAndDb(campaignsFromDb, campaignsUuidFromBC)
}

