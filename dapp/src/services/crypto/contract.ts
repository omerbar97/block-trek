import { ethers } from 'ethers';
// import fs from 'fs'
import { updateCampaignInDb } from '../controller/campaign';
import { FACTORY_ABI } from './abi';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


export async function getNewContractAddress(transactionHash: string) {
    const provider = new ethers.JsonRpcProvider(); // You may need to specify your provider URL
    const transactionReceipt = await provider.waitForTransaction(transactionHash);
    // Now, you can access the contract address from the transaction receipt
    const contractAddress = transactionReceipt?.contractAddress;
    return contractAddress
}


async function generateABI() {
    // Read the compiled contract JSON file
    const compiledContract = JSON.parse(FACTORY_ABI);
    // Extract the ABI definition from the compiled contract
    const abi = compiledContract.abi;
    // const json = JSON.stringify(abi)
    return abi
}

let campaignFactoryContract: ethers.Contract | null = null;

export const getCampaignFactoryContract = async () => {
    try {
        // If contract instance already exists, return it
        if (campaignFactoryContract) {
            return campaignFactoryContract;
        }
        const provider = await new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL);
        const signer = await provider.getSigner();
        const abi = await generateABI();
        campaignFactoryContract = await new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        // Creating event listeners for events

        campaignFactoryContract.on("CampaignCreated", async (campaignAddress: string, owner: string, uuid: string) => {
            console.log("New campaign created: ");
            console.log("Campaign Address:", campaignAddress);
            console.log("Owner:", owner);
            
            // Sending request to db to add a new campaign to the db
            await updateCampaignInDb(uuid, {contractAddress: campaignAddress})
        });

        return campaignFactoryContract;
    } catch (e) {
        console.log("Failed to get blockchain factory contract ", e);
        return null;
    }
}

export const requestCreationOfNewCampaign = async (
    campaignName: string,
    description: string,
    endDate: number,
    goalAmountInWei: bigint,
    campaignType: string,
    uuid: string
) => {
    try {
        const service = await getCampaignFactoryContract();
        if (service) {
            // Assuming createCampaign method exists on the contract
            const transaction = await service.createCampaign(
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType,
                uuid,
            );

            await transaction.wait();
            console.log("New campaign created successfully!");
        } else {
            console.log("Failed to obtain campaign factory contract.");
        }
    } catch (error) {
        console.log("Failed to request creation of new campaign ", error);
    }
}




