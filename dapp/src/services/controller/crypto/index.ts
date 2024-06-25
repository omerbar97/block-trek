import { getCampaignContractForBackend } from "@/services/crypto/backend"

export async function getDeployedCampaignsUuidFromBlockchain() {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const campaigns = await contract.methods.getDeployedCampaignsUuid().call() as string[]
    return campaigns
}

export async function getCampaignByUuidFromBlockchain(uuid: string) {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const campaign = await contract.methods.getCampaign(uuid).call()
    return campaign
}

export async function getCampaignContributionByUuid(uuid: string) {
    const contract = await getCampaignContractForBackend()
    if (contract == null || contract == undefined) {
        throw new Error("Couldn't get contract")
    }
    
    const contributers = await contract.methods.getContributions(uuid).call()
    return contributers
}