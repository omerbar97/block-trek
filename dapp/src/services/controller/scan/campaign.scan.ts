import { deleteCampaignFromDb, getAllCampaignsFromDb, getCampaignByUuid, saveCampaignToDbUpdate, updateCampaignInDbByUuid } from "../campaign";
import { Campaign, CampaignCategory, CampaignType, Contributer } from "@prisma/client";
import { getOwnerByWalletAddress } from "../owner";
import { getCampaignByUuidFromBlockchain, getCampaignContributionByUuid, getDeployedCampaignsUuidFromBlockchain } from "../crypto";
import { getContributetrsByCampaignUuid, saveContributersToDb } from "../contributers";
import { getContributionScanIndex, updateContributionScanIndex } from "../scanindex";
import { getUnixTime } from "date-fns";


const bigintToString = (value: bigint): string => {
    return value.toString();
};


interface CampaignFromBlockchain {
    uuid: string;
    owner: string;
    campaignName: string;
    campaignDescription: string;
    contributorsKeys: string[];
    startDate: number;
    endDate: number;
    goalAmount: bigint;
    totalContributions: bigint;
    campaignType: string;
    contributors: { [address: string]: number };
    isFinished: boolean
}

interface ContributionsFromBlockchain {
    keys: string[];
    amounts: bigint[];
    dates: number[];
}

const transformCampaignToJson = (input: any): CampaignFromBlockchain => {
    return {
        // campaign.uuid,
        // campaign.owner,
        // campaign.campaignName,
        // campaign.campaignDescription,
        // campaign.startDate,
        // campaign.endDate,
        // campaign.goalAmount,
        // campaign.totalContributions,
        // campaign.campaignType,
        // campaign.contributorsKeys,
        // campaign.isFinished
        uuid: input['0'],
        owner: input['1'],
        campaignName: input['2'],
        campaignDescription: input['3'],
        startDate: Number(input['4']),
        endDate: Number(input['5']),
        goalAmount: BigInt(input['6']),
        totalContributions: BigInt(input['7']),
        campaignType: input['8'],
        contributorsKeys: input['9'],
        isFinished: input['10'],
        contributors: {},
    };
};

const transformContributersToJson = (input: any): ContributionsFromBlockchain => {
    return {
        keys: input['0'],
        amounts: input['1'],
        dates: input['2'],
    };
};

async function handleCampaignNotInDb(campaignFromBC: CampaignFromBlockchain) {
    const owner = await getOwnerByWalletAddress(campaignFromBC.owner);
    if (!owner) {
        throw new Error("the owner doesn't exsits so not uploading this campaign")
    }
    let goal = bigintToString(campaignFromBC.goalAmount)
    console.log(campaignFromBC.endDate)
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
    const flag = await saveCampaignToDbUpdate(data)
    if (!flag) return

    // Saving the contributers
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignFromBC.uuid)
    const contributersJson = transformContributersToJson(contributersFromBlockchain)

    // getting all the data about contributers we have
    const contributersFromDb = await getContributetrsByCampaignUuid(campaignFromBC.uuid)
    const campaign = await getCampaignByUuid(campaignFromBC.uuid)
    if (campaign === null) {
        throw new Error("failed to get campaign from database to get the campain id")
    }
    await updateContributionInDbForCampaign(campaign.id, contributersFromDb, contributersJson)
}

async function updateContributionInDbForCampaign(campaignId: number, contributersFromDb: Contributer[]|null, contributersJson: ContributionsFromBlockchain) {
    console.log("try to updateContributionInDbForCampaign for campaign id: " + campaignId)
    let shouldUpdateCurser = contributersJson.keys.length > 0
    try {
        if (contributersFromDb === null) {
            // adding all the contributers from blockchain
            let i = 0;
            for(; i < contributersJson.keys.length; i++) {
                const contributer = {
                    name: null,
                    walletAddress: contributersJson.keys[i],
                    amount: contributersJson.amounts[i],
                    date: new Date(contributersJson.dates[i]),
                    campaignId: campaignId
                }
                await saveContributersToDb(contributer)
            }
            if (shouldUpdateCurser) {
                await updateContributionScanIndex(campaignId, i)
            }
        } else {
            const index = await getContributionScanIndex(campaignId)
            // checking that the contribution is not included
            let i = index ? index.value : 0
            for(; i < contributersJson.keys.length; i++) {
                const arrayFilterd = contributersFromDb.filter(item => item.walletAddress === contributersJson.keys[i]);
                if (arrayFilterd) {
                    const latestItem = arrayFilterd.reduce((prev, current) =>
                        (prev.date > current.date) ? prev : current
                    );
                    const sum = arrayFilterd.reduce((accumulator, currentValue) => accumulator + BigInt(currentValue.amount), BigInt(0));
                    
                    const value = BigInt(latestItem.amount)
                    if (sum !== value) {
                        // adding the differences
                        const contributer = {
                            name: null,
                            walletAddress: contributersJson.keys[i],
                            amount: sum > value ? sum - value : value - sum,
                            date: new Date(contributersJson.dates[i]*1000),
                            campaignId: campaignId
                        }
                        await saveContributersToDb(contributer)
                    }
                } else {
                    // the wallet from the contribution is not in the filteredArray
                    const contributer = {
                        name: null,
                        walletAddress: contributersJson.keys[i],
                        amount: contributersJson.amounts[i],
                        date: new Date(contributersJson.dates[i]*1000),
                        campaignId: campaignId
                    }
                    await saveContributersToDb(contributer)
                }
                if (shouldUpdateCurser) {
                    await updateContributionScanIndex(campaignId, i)
                }
            }
        }
    } catch (error) {
        console.log("failed to updateContributionInDbForCampaign for campaign id: " + campaignId + " " + error)
    }
}

async function updateCampaignDetailsInDb(campaignFromDb: Campaign, campaignFromBC: CampaignFromBlockchain) {
    console.log("updating campaign details from blockchain for campaign id: " + campaignFromDb.id)
    try {
        campaignFromDb.updatedAt = new Date()
        campaignFromDb.collected = bigintToString(campaignFromBC.totalContributions)
        campaignFromDb.isFinished = campaignFromBC.totalContributions > campaignFromBC.goalAmount
        campaignFromDb.isFailed = getUnixTime(new Date()) > campaignFromBC.endDate
        await updateCampaignInDbByUuid(campaignFromDb.uuid, campaignFromDb)
    } catch (error) {
        console.log("failed to update campaign details from blockchain for campaign id: " + campaignFromDb.id + " " + error)
    }
}

async function handleCampaignsAndInsertToDb(uuid: string) {
    const campaignFromBCNoType = await getCampaignByUuidFromBlockchain(uuid)
    const campaignFromBC = transformCampaignToJson(campaignFromBCNoType)
    const campaignFromDb = await getCampaignByUuid(uuid)
    if(campaignFromDb === null) {
        await handleCampaignNotInDb(campaignFromBC)
        return
    }

    // updating the information for the campaign
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignFromBC.uuid)
    const contributersJson = transformContributersToJson(contributersFromBlockchain)
    const contributionFromDb = await getContributetrsByCampaignUuid(campaignFromDb.uuid)
    await updateContributionInDbForCampaign(campaignFromDb.id, contributionFromDb, contributersJson)
    await updateCampaignDetailsInDb(campaignFromDb, campaignFromBC)
}

async function syncCampaignsBetweenBlockchainAndDb(campaignsFromDb: Campaign[], campaignsUuidFromBC: string[]) {
    try {
        // Check for campaigns in blockchain but not in the database
        const campaignsNotInDb = campaignsFromDb.filter(campaign => !campaignsUuidFromBC.some(uuid => uuid === campaign.uuid));
        // deleting all the campaignsNotInDb
        for(let i = 0; i < campaignsNotInDb.length; i++) {
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

