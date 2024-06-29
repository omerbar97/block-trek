import { deleteCampaignFromDb, getCampaignByUuid} from "../campaign";
import { deleteAllContributersForCampaignByCampaignId } from "../contributers";
import { getDeployedCampaignsUuidFromBlockchain } from "../crypto";

export async function scanSyncCampaignsFromDbToBlockchain(campaignUuid: string) {
    const campaignsUuidFromBC = await getDeployedCampaignsUuidFromBlockchain() as string[]
    // checking if all the campaigns are sync with the database
    const campaignsFromDb = await getCampaignByUuid(campaignUuid)
    if (!campaignsFromDb) throw new Error("campaign doesn't exists in db")
    
    // if campaign doesn't exists in blockchain deleting it
    const isCampaignInBlockchain = campaignsUuidFromBC.some(uuid => uuid === campaignUuid);
    if(!isCampaignInBlockchain) {
        // deleting the campaign
        await deleteAllContributersForCampaignByCampaignId(campaignsFromDb.id)
        await deleteCampaignFromDb(campaignUuid)
    }
}