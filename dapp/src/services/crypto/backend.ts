import { FACTORY_ABI } from "./abi";
import { CONTRACT_ADDRESS, CONTRACT_URL } from "./contract";
import { Contract, Web3 } from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(CONTRACT_URL));
let CampaignFactory: undefined | Contract<any> = undefined

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
        const abi = await generateABI();
        CampaignFactory = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        return CampaignFactory;
    } catch (e) {
        console.log("Failed to get blockchain factory contract ", e);
        return null;
    }
}