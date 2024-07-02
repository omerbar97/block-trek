import { Contract, ethers } from 'ethers';
import { FACTORY_ABI } from './abi';
import { getProviders } from './wallet';
import { genericToast } from '@/utils/toast';

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const CONTRACT_URL = "http://localhost:8545"
export const CONTRACT_NAME = "CampaignFactory"


async function generateABI() {
    // Read the compiled contract JSON file
    const compiledContract = JSON.parse(FACTORY_ABI);
    // Extract the ABI definition from the compiled contract
    const abi = compiledContract.abi;
    // const json = JSON.stringify(abi)
    return abi
}

let CampaignContractFrontend: undefined|Contract = undefined
export const getCampaignFactoryContract = async () => {
    try {
        if (CampaignContractFrontend !== undefined && CampaignContractFrontend !== null) {
            return CampaignContractFrontend
        }
        const ethereum = window.ethereum
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.JsonRpcProvider(CONTRACT_URL)
        const signer = provider.getSigner(0)
        const abi = await generateABI();
        const CampaignContract = await new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        console.log(CampaignContract)

        CampaignContract.on("Contribution", async (uuid: string, contributor: string, amount: bigint, time: number) => {
            genericToast("New Contribution by " + contributor, "Donated " + amount.toString() + " to " + uuid + " At: " + new Date(time).toString());
          });
      
          CampaignContract.on("Refund", async (uuid: string, contributor: string, amount: bigint, time: number) => {
            genericToast("Refund Issued to " + contributor, "Amount: " + amount.toString() + " for campaign " + uuid + " At: " + new Date(time).toString());
          });
      
          CampaignContract.on("Withdrawal", async (uuid: string, amount: bigint, time: number) => {
            genericToast("Withdrawal from Campaign " + uuid, "Amount: " + amount.toString() + " At: " + new Date(time).toString());
          });
      
          CampaignContract.on("CampaignCompleted", async (uuid: string, time: number) => {
            genericToast("Campaign Completed", "Campaign UUID: " + uuid + " At: " + new Date(time).toString());
          });
      
          CampaignContract.on("FundsRetrievedByCampaignOwner", async (uuid: string, owner: string, amount: bigint) => {
            genericToast("Funds Retrieved by Campaign Owner", "Owner: " + owner + " Amount: " + amount.toString() + " for campaign " + uuid);
          });
      
          CampaignContract.on("FundsRetrieved", async (uuid: string, owner: string, amount: bigint) => {
            genericToast("Funds Retrieved", "Owner: " + owner + " Amount: " + amount.toString() + " for campaign " + uuid);
          });
          CampaignContractFrontend = CampaignContract
        return CampaignContract;
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
        const providers = await getProviders()
        if (service && providers) {
            const signer = await providers.getSigner()
            const signedService = service.connect(signer);
            // Estimate gas
            const gasLimit = await signedService.estimateGas.createCampaign(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType
            );
            const transaction = await signedService.createCampaign(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType, { gasLimit: gasLimit.add(10000) });

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
        const provider = await getProviders()
        if (service && provider) {
            const signer = provider.getSigner();
            const signedService = service.connect(signer);
            const gasLimit = await signedService.estimateGas.donate(
                uuid, { value: amount }
            );
            const transaction = await signedService.donate(uuid, { value: amount, gasLimit: gasLimit.add(25000) });
            await transaction.wait();
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

export const requestBlockchainForRefund = async (
    uuid: string,
) => {
    try {
        const service = await getCampaignFactoryContract();
        const provider = await getProviders()
        if (service && provider) {
            const signer = provider.getSigner();
            const signedService = service.connect(signer);
            const gasLimit = await signedService.estimateGas.getMoneyBackFromCampaign(
                uuid
            );
            const transaction = await signedService.getMoneyBackFromCampaign(uuid, { gasLimit: gasLimit.add(20000) });
            await transaction.wait();
            return true
        } else {
            console.log("Failed to obtain campaign factory contract or provider.");
            return false;
        }
    } catch (error) {
        console.log("Failed to refund from campaign ", uuid, " with error: ", error);
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