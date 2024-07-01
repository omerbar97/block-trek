import { getCampaignContractForBackend } from "@/services/crypto/backend"


export interface ContributionsFromBlockchain {
    keys: string[];
    amounts: bigint[];
    dates: bigint[];
}

const transformContributersToJson = (input: any): ContributionsFromBlockchain => {
    return {
        keys: input['0'],
        amounts: input['1'],
        dates: input['2'],
    };
};

export interface CampaignFromBlockchain {
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
    isFinished: boolean;
    isOwnerRetrievedDonations: boolean;
}

const transformCampaignToJson = (input: any): CampaignFromBlockchain => {
    return {
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
        isOwnerRetrievedDonations: input['11'],
        contributors: {},
    };
};

export async function getDeployedCampaignsUuidFromBlockchain() {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const campaigns = await contract.methods.getDeployedCampaignsUuid().call() as string[]
    return campaigns
}

export async function getCampaignByUuidFromBlockchain(uuid: string): Promise<CampaignFromBlockchain> {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const campaign = await contract.methods.getCampaign(uuid).call()
    return transformCampaignToJson(campaign)
}

export async function getCampaignContributionByUuid(uuid: string): Promise<ContributionsFromBlockchain> {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const contributers = await contract.methods.getContributions(uuid).call()
    return transformContributersToJson(contributers)
}