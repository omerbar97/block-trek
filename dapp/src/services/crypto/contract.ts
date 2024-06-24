import { ethers } from 'ethers';
import { FACTORY_ABI } from './abi';
import { getProviders } from './wallet';
import { genericToast } from '@/utils/toast';

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CONTRACT_URL = "http://localhost:8545"


async function generateABI() {
    // Read the compiled contract JSON file
    const compiledContract = JSON.parse(FACTORY_ABI);
    // Extract the ABI definition from the compiled contract
    const abi = compiledContract.abi;
    // const json = JSON.stringify(abi)
    return abi
}


export const getCampaignFactoryContract = async () => {
    try {
        const ethereum = window.ethereum
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.JsonRpcProvider(CONTRACT_URL)
        const signer = provider.getSigner(0)
        const abi = await generateABI();
        const campaignFactoryContract = await new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        campaignFactoryContract.on("CampaignCreated", async (uuid: string, owner: string) => {
            genericToast("New Campaign Created!", "By the owner: " + owner)
            // console.log("New campaign created with the following parameters");
            // console.log("Owner Wallet Address: ", owner);
            // console.log("Campaign UUID: ", uuid);
        });

        campaignFactoryContract.on("Contribution", async (uuid: string, owner: string, amount: bigint, time:number) => {
            genericToast("New Contribution by " + owner, "Donated " + amount.toString() + " to " + uuid)
            // console.log("New Contribution");
            // console.log("Contiruber: ", owner);
            // console.log("Campaign UUID: ", uuid);
            // console.log("Amount: ", amount);
            // console.log("Time: ", time);
        });

        return campaignFactoryContract;
    } catch (e) {
        console.log("Failed to get blockchain factory contract ", e);
        return null;
    }
}

export const requestBlockchainForNewCampaign = async (
    uuid: string,
    campaignName: string,
    description: string,
    endDate: number,
    goalAmountInWei: bigint,
    campaignType: string,
) => {
    try {
        const service = await getCampaignFactoryContract();
        console.log(service)
        const providers = await getProviders()
        if (service && providers) {
            const signer = await providers.getSigner()
            const signedService = service.connect(signer);
            const transaction = await signedService.createCampaign(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType);

            await transaction.wait();
            console.log(transaction);
            return true
        } else {
            console.log("Failed to obtain campaign factory contract.");
            return false
        }
    } catch (error) {
        console.log("Failed to request creation of new campaign ", error);
        return false
    }
}


export const requestBlockchainForDonation = async (
    uuid: string,
    amount: bigint
) => {
    try {
        const service = await getCampaignFactoryContract();
        console.log(service)
        const provider = await getProviders()
        if (service && provider) {
            const signer = provider.getSigner();
            const signedService = service.connect(signer);
            const transaction = await signedService.donate(uuid, { value: amount });
            await transaction.wait();
            console.log(transaction);
            return true
        } else {
            console.log("Failed to obtain campaign factory contract or provider.");
            return false;
        }
    } catch (error) {
        console.log("Failed to donate to campaign ", uuid, " with error: ", error);
        return false;
    }
}

export const requestBlockchainForCampaign = async (
    uuid: string
) => {
    try {
        const service = await getCampaignFactoryContract();
        if (service) {
            const transaction = await service.getCampaign(uuid)
            console.log("campaign: ", transaction)
            return true
        } else {
            console.log("Failed to obtain campaign factory contract.");
            return false
        }
    } catch (error) {
        console.log("Failed to donate to campaign ", uuid ," with error: ", error);
        return false
    }
}