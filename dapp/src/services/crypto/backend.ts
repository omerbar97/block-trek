import { ethers, Contract } from "ethers"
import { FACTORY_ABI } from "./abi";
import { CONTRACT_ADDRESS, CONTRACT_URL } from "./contract";

let CampaignFactory: Contract | undefined = undefined

async function generateABI() {
    // Read the compiled contract JSON file
    const compiledContract = JSON.parse(FACTORY_ABI);
    // Extract the ABI definition from the compiled contract
    const abi = compiledContract.abi;
    // const json = JSON.stringify(abi)
    return abi
}

export const getCampaignContractForBackend = async () => {
    try {
        if(CampaignFactory != undefined) {
            return CampaignFactory
        }
        const provider = new ethers.providers.JsonRpcProvider(CONTRACT_URL)
        const signer = provider.getSigner(0)
        const abi = await generateABI();
        CampaignFactory = await new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        return CampaignFactory;
    } catch (e) {
        console.log("Failed to get blockchain factory contract ", e);
        return null;
    }
}