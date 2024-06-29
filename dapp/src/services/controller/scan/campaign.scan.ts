import { deleteCampaignFromDb, getAllCampaignsFromDb, getCampaignByUuid, saveCampaignToDbUpdate, updateCampaignInDbByUuid } from "../campaign";
import { Campaign, CampaignCategory, CampaignType, Contributer } from "@prisma/client";
import { getOwnerByWalletAddress } from "../owner";
import { getCampaignByUuidFromBlockchain, getCampaignContributionByUuid, getDeployedCampaignsUuidFromBlockchain } from "../crypto";
import { deleteAllContributersForCampaignByCampaignId, getContributetrsByCampaignUuid, saveContributersToDb, updateAllContributersToBeRefundedByCampaignIdAndWallet } from "../contributers";
import { updateContributionScanIndex } from "../scanindex";
import { getUnixTime } from "date-fns";
import { convertToJSDate } from "@/utils/date";


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
    dates: bigint[];
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
    const flag = await saveCampaignToDbUpdate(data as Campaign)
    if (!flag) return

    // Saving the contributers
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignFromBC.uuid)
    const contributersJson = transformContributersToJson(contributersFromBlockchain)

    // getting all the data about contributers we have
    const contributersFromDb = await getContributetrsByCampaignUuid(campaignFromBC.uuid)
    const campaign = await getCampaignByUuid(campaignFromBC.uuid)
    if (campaign === null) {
        throw new Error("failed to get campaign from database to get the campain id for campaign uuid: " + campaignFromBC.uuid)
    }
    if (contributersFromDb === null) {
        throw new Error("failed to get contributers from database for campain id: " + campaign.id)
    }
    await updateContributionInDbForCampaign(campaign.id, contributersFromDb, contributersJson)
}

async function updateContributionInDbForCampaign(campaignId: number, contributersFromDb: Contributer[], contributersJson: ContributionsFromBlockchain) {
    console.log("try to updateContributionInDbForCampaign for campaign id: " + campaignId)
    let shouldUpdateCurser = contributersJson.keys.length - contributersFromDb?.length > 0
    try {
        if (contributersFromDb.length === 0) {
            // adding all the contributers from blockchain
            let i = 0;
            for(; i < contributersJson.keys.length; i++) {
                const contributer = {
                    name: null,
                    walletAddress: contributersJson.keys[i],
                    amount: bigintToString(contributersJson.amounts[i]),
                    date: convertToJSDate(contributersJson.dates[i]),
                    campaignId: campaignId
                }
                await saveContributersToDb(contributer as Contributer)
            }
            if (shouldUpdateCurser) {
                await updateContributionScanIndex(campaignId, i)
            }
        } else {
            let i = 0
            for(; i < contributersJson.keys.length; i++) {
                const arrayFilterd = contributersFromDb.filter(item => item.walletAddress === contributersJson.keys[i]);
                let sumInDatabase = BigInt(0)
                if (arrayFilterd) {
                    let latestItem = null
                    if (arrayFilterd.length == 1) {
                        latestItem = arrayFilterd[0]
                        sumInDatabase = BigInt(arrayFilterd[0].amount)
                    } else {
                        latestItem = arrayFilterd.reduce((prev, current) =>
                            (prev.date > current.date) ? prev : current
                        );
                        sumInDatabase = arrayFilterd.reduce((acc, e) => acc + BigInt(e.amount), sumInDatabase);
                    }
                    const sumInBlockChain = contributersJson.amounts[i]
                    if (sumInBlockChain == BigInt(0) && !latestItem.isRefunded) {
                        // this means that a person already contributers with the wallet but then refunded the amount
                        await updateAllContributersToBeRefundedByCampaignIdAndWallet(campaignId, contributersJson.keys[i])
                    } else {
                        if(sumInBlockChain > sumInDatabase) {
                            // that's mean there were more contribution that happened on the blockchain
                            const contributer = {
                                name: null,
                                walletAddress: contributersJson.keys[i],
                                amount: bigintToString(sumInBlockChain - sumInDatabase),
                                date: convertToJSDate(contributersJson.dates[i]),
                                campaignId: campaignId
                            }
                            await saveContributersToDb(contributer as Contributer)
                        } else if (sumInBlockChain !== sumInDatabase) {
                            // adding the differences
                            const contributer = {
                                name: null,
                                walletAddress: contributersJson.keys[i],
                                amount: bigintToString(sumInDatabase - sumInBlockChain),
                                date: convertToJSDate(contributersJson.dates[i]),
                                campaignId: campaignId
                            }
                            await saveContributersToDb(contributer as Contributer)
                        }
                    }
                } else {
                    // the wallet from the contribution is not in the filteredArray
                    const contributer = {
                        name: null,
                        walletAddress: contributersJson.keys[i],
                        amount: bigintToString(contributersJson.amounts[i]),
                        date: convertToJSDate(contributersJson.dates[i]),
                        campaignId: campaignId
                    }
                    await saveContributersToDb(contributer as Contributer)
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
    if (contributionFromDb === null) {
        throw new Error("failed to get campaign from db")
    }
    await updateContributionInDbForCampaign(campaignFromDb.id, contributionFromDb, contributersJson)
    await updateCampaignDetailsInDb(campaignFromDb, campaignFromBC)
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

