import { BigNumber, Contract } from "ethers";
import { getCampaignByUuid, saveCampaignToDb } from "../campaign";
import { CampaignCategory, CampaignType } from "@prisma/client";
import { getOwnerByWalletAddress } from "../owner";
import { getCampaignContractForBackend } from "@/services/crypto/backend";

interface CampaignFromBlockchain {
    uuid: string;
    owner: string;
    campaignName: string;
    campaignDescription: string;
    contributorsKeys: string[];
    startDate: number;
    endDate: number;
    goalAmount: number;
    totalContributions: number;
    campaignType: string;
    contributors: { [address: string]: number };
    isFinished: boolean
}

interface ContributionsFromBlockchain {
    keys: string[];
    values: BigNumber[];
}

async function handleCampaignNotInDb(contract: Contract, campaignFromBC: CampaignFromBlockchain) {
    // return value from the getCampaign:
    // campaign.uuid,
    // campaign.owner,
    // campaign.campaignName,
    // campaign.campaignDescription,
    // campaign.startDate,
    // campaign.endDate,
    // campaign.goalAmount,
    // campaign.totalContributions,
    // campaign.campaignType,
    // campaign.contributorsKeys
    const owner = await getOwnerByWalletAddress(campaignFromBC.owner);
    if (!owner) {
        // the owner doesn't exsits so not uploading this campaign
        throw new Error("the owner doesn't exsits so not uploading this campaign")
    }
    const data = {
        title: campaignFromBC.campaignName,
        uuid: campaignFromBC.uuid,
        description: campaignFromBC.campaignDescription,
        category: CampaignCategory.NO_CATEGORY,
        video: "",
        image: "",
        goal: campaignFromBC.goalAmount.toString(),
        type: CampaignType.Donation,
        endAt: new Date(campaignFromBC.endDate),
        createdAt: new Date(campaignFromBC.startDate),
        walletAddress: campaignFromBC.owner,
        isFinished: campaignFromBC.isFinished,
    }
    const flag = await saveCampaignToDb(data, owner.id)
    if (!flag) return

    // Saving the contributers
    const [keys, values] = await contract.getContributions(campaignFromBC.uuid) as [
        keys: string[],
        values: BigNumber[]
    ]

}


async function handleCampaignsAndInsertToDb(contract: Contract,uuid: string) {
    const campaignFromBC = await contract.getCampaign(uuid) as CampaignFromBlockchain
    const campaignFromDb = await getCampaignByUuid(uuid)
    console.log("campaign from blockchain:", campaignFromBC)
    console.log("campaign from db:", campaignFromDb)
    if(!campaignFromDb) {
        // do something
    }
}

export async function scanCampaignsAndInsertToDb() {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    // console.log(contract)
    // Reading all the campaigns
    const campaigns = await contract.getDeployedCampaignsUuid() as string[]
    console.log(campaigns)
    // for(let i = 0; i < campaigns.length; i++) {
    //     await handleCampaignsAndInsertToDb(contract, campaigns[i])
    // }
}