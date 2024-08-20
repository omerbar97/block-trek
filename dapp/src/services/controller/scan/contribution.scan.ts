import { convertToJSDate } from "@/utils/date";
import { getCampaignByUuid } from "../campaign";
import { getContributetrsFromDbByCampaignUuid, getSumOfContributerByCampaignIdAndWalletAddress, saveContributersToDb, updateAllContributersToBeRefundedByCampaignIdAndWallet } from "../contributers";
import { ContributionsFromBlockchain, getCampaignByUuidFromBlockchain, getCampaignContributionByUuid, getDeployedCampaignsUuidFromBlockchain } from "../crypto";
import { bigintToString } from "./campaign.scan";
import { Contributer } from "@prisma/client";


export async function addAllContributersFromBlockchainToDb(campaignId: number, contributersFromBC: ContributionsFromBlockchain) {
    let i = 0;
    for(; i < contributersFromBC.keys.length; i++) {
        if(contributersFromBC.amounts[i] > BigInt(0)) {
            const contributer = {
                name: null,
                walletAddress: contributersFromBC.keys[i],
                amount: bigintToString(contributersFromBC.amounts[i]),
                date: convertToJSDate(contributersFromBC.dates[i]),
                campaignId: campaignId
            }
            await saveContributersToDb(contributer as Contributer)
        }
    }
}

export async function addContributionFromBlockchainToDbWithChecks(campaignId: number, contributersFromBC: ContributionsFromBlockchain, contributersFromDb: Contributer[]) {
    for(let i = 0; i < contributersFromBC.keys.length; i++ ) {
        const arrayFilterd = contributersFromDb.filter(item => item.walletAddress === contributersFromBC.keys[i]);
        let sumInDatabase = await getSumOfContributerByCampaignIdAndWalletAddress(campaignId, contributersFromBC.keys[i])
        if (arrayFilterd.length > 0) {
            let latestItem: Contributer
            if (arrayFilterd.length == 1) {
                latestItem = arrayFilterd[0]
            } else {
                latestItem = arrayFilterd.reduce((prev, current) =>
                    (prev.date > current.date) ? prev : current
                );
            }
            const sumInBlockChain = contributersFromBC.amounts[i]
            if (sumInBlockChain == BigInt(0) && !latestItem.isRefunded) {
                // this means that a person already contributers with the wallet but then refunded the amount
                await updateAllContributersToBeRefundedByCampaignIdAndWallet(campaignId, contributersFromBC.keys[i])
            } else {
                if(sumInBlockChain > sumInDatabase) {
                    // that's mean there were more contribution that happened on the blockchain
                    const contributer = {
                        name: null,
                        walletAddress: contributersFromBC.keys[i],
                        amount: bigintToString(sumInBlockChain - sumInDatabase),
                        date: convertToJSDate(contributersFromBC.dates[i]),
                        campaignId: campaignId
                    }
                    await saveContributersToDb(contributer as Contributer)
                } else if (sumInBlockChain < sumInDatabase) {
                    // adding the differences
                    await updateAllContributersToBeRefundedByCampaignIdAndWallet(campaignId, contributersFromBC.keys[i])
                    const contributer = {
                        name: null,
                        walletAddress: contributersFromBC.keys[i],
                        amount: bigintToString(sumInBlockChain),
                        date: convertToJSDate(contributersFromBC.dates[i]),
                        campaignId: campaignId
                    }
                    await saveContributersToDb(contributer as Contributer)
                }
            }
        } else {
            // the wallet from the contribution is not in the filteredArray
            const contributer = {
                name: null,
                walletAddress: contributersFromBC.keys[i],
                amount: bigintToString(contributersFromBC.amounts[i]),
                date: convertToJSDate(contributersFromBC.dates[i]),
                campaignId: campaignId
            }
            await saveContributersToDb(contributer as Contributer)
        }
    }
}

export async function scanSyncContributionFromBlockchainToDb(campaignUuid: string) {
    const campaignsFromDb = await getCampaignByUuid(campaignUuid)
    if (!campaignsFromDb) throw new Error("campaign doesn't exists in db need to run the sync campaign method")

    // now getting all the contributers for that campaign from the Database
    const contributersFromDb = await getContributetrsFromDbByCampaignUuid(campaignUuid)
    const contributersFromBlockchain = await getCampaignContributionByUuid(campaignUuid)
    if (!contributersFromDb) {
        // in the database there is no contributers 
        // syncing the contributers from the blockchain
        await addAllContributersFromBlockchainToDb(campaignsFromDb.id, contributersFromBlockchain)
    } else if (contributersFromBlockchain.keys.length > 0) {
        await addContributionFromBlockchainToDbWithChecks(campaignsFromDb.id, contributersFromBlockchain, contributersFromDb)
    }
}
