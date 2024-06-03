import { ethers } from 'ethers';
// import fs from 'fs'
import { FACTORY_ABI } from './abi';
import axios from 'axios';

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

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


export const getCampaignFactoryContract = async () => {
    try {
        const provider = await new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL);
        const signer = await provider.getSigner()
        const abi = await generateABI();
        const campaignFactoryContract = await new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        campaignFactoryContract.on("CampaignCreated", async (campaignAddress: string, owner: string, uuid: string) => {
            console.log("New campaign created with the following parameters");
            console.log("Campaign Address: ", campaignAddress);
            console.log("Owner Wallet Address: ", owner);
            console.log("Campaign UUID: ", uuid);
            const data = {
                uuid: uuid,
                contractAddress: campaignAddress,
                ownerWallet: owner
            }
            await axios.put('/api/campaign', data)
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
    uuid: string,
    ownerWalletAddress: string
) => {
    try {
        const service = await getCampaignFactoryContract();
        if (service) {
            // Assuming createCampaign method exists on the contract
            console.log(campaignName)
            console.log(description)
            console.log(endDate)
            console.log(goalAmountInWei)
            console.log(campaignType)
            console.log(ownerWalletAddress)
            console.log(uuid)
            const transaction = await service.createCampaign(
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType,
                ownerWalletAddress,
                uuid
            );

            await transaction.wait();
            console.log(transaction)
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




