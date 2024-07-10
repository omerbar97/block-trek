import { Contract, ethers } from 'ethers';
import { FACTORY_ABI } from './abi';
import { getProviders } from './wallet';
import { genericToast } from '@/utils/toast';
import { CONTRACT_ADDRESS, CONTRACT_URL } from './consts';
import { wetToEthBigIntFormat } from '@/utils/crypto';


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

        // event Contribution(string campaignName, address indexed contributor, uint256 amount, uint256 time);
        // event Refund(string campaignName, address indexed contributor, uint256 amount, uint256 time);
        // event CampaignCompleted(string campaignName, uint256 goalAmount ,uint256 time);
        // event FundsRetrievedByCampaignOwner(string campaignName, address owner, uint256 amount);
        // event CampaignCreated (
        //     string uuid,
        //     string campaignName,
        //     address indexed owner
        // );

        CampaignContract.on("Contribution", async (campaignName: string, contributor: string, amount: bigint, time: number) => {
            genericToast("New Contribution by " + contributor, "Donated " + wetToEthBigIntFormat(amount) + " to " + campaignName + " At: " + new Date(time).toString());
          });
      
        CampaignContract.on("Refund", async (campaignName: string, contributor: string, amount: bigint, time: number) => {
        genericToast("Refund Issued to " + contributor, "Amount: " + wetToEthBigIntFormat(amount) + " for campaign " + campaignName + " At: " + new Date(time).toString());
        });
    
        CampaignContract.on("CampaignCompleted", async (campaignName: string, goalAmount: bigint,time: number) => {
        genericToast("'"+ campaignName +"' Campaign Completed", " At: " + new Date(time).toString() + " With amount of: " + (goalAmount));
        });
    
        CampaignContract.on("FundsRetrievedByCampaignOwner", async (campaignName: string, owner: string, amount: bigint) => {
        genericToast("Funds Retrieved by Campaign Owner", "The Owner '" + owner + "' Retreived their funding Amount " + amount.toString() + " For " + campaignName + " Campaign");
        });

        CampaignContract.on("CampaignCreated", async (uuid: string, campaignName: string, address: string) => {
        genericToast("A New Campaign Was Created!", "The Owner '" + address + "' Created A New Campaign Called '" + campaignName + "'");
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
            console.log(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType
            )
            // Estimate gas
            const gasLimit = await signedService.estimateGas.createCampaign(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType
            );
            // Fetch current gas fee data
            const feeData = await providers.getFeeData();
            // Set gas fee parameters
            const maxFeePerGas = feeData.maxFeePerGas?.mul(2) || ethers.utils.parseUnits('100', 'gwei');
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.mul(2) || ethers.utils.parseUnits('2', 'gwei');
            
            const transaction = await signedService.createCampaign(
                uuid, 
                campaignName,
                description,
                endDate,
                goalAmountInWei,
                campaignType, { 
                    gasLimit: gasLimit.add(10000),
                    maxFeePerGas: maxFeePerGas,
                    maxPriorityFeePerGas: maxPriorityFeePerGas
                });

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
            // Fetch current gas fee data
            const feeData = await provider.getFeeData();
            const maxFeePerGas = feeData.maxFeePerGas?.mul(2) || ethers.utils.parseUnits('100', 'gwei');
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.mul(2) || ethers.utils.parseUnits('2', 'gwei');
            const transaction = await signedService.donate(uuid, {
                    value: amount,
                    gasLimit: gasLimit.add(10000),
                    maxFeePerGas: maxFeePerGas,
                    maxPriorityFeePerGas: maxPriorityFeePerGas
                });
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
            // Fetch current gas fee data
            const feeData = await provider.getFeeData();
            const maxFeePerGas = feeData.maxFeePerGas?.mul(2) || ethers.utils.parseUnits('100', 'gwei');
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.mul(2) || ethers.utils.parseUnits('2', 'gwei');
            const transaction = await signedService.getMoneyBackFromCampaign(uuid, 
                {   
                    gasLimit: gasLimit.add(10000),
                    maxFeePerGas: maxFeePerGas,
                    maxPriorityFeePerGas: maxPriorityFeePerGas
                });
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

export const requestBlockchainForOwnerFunds = async (
    uuid: string,
) => {
    try {
        const service = await getCampaignFactoryContract();
        const provider = await getProviders()
        if (service && provider) {
            const signer = provider.getSigner();
            const signedService = service.connect(signer);
            const gasLimit = await signedService.estimateGas.getCampaignDonation(
                uuid
            );
            // Fetch current gas fee data
            const feeData = await provider.getFeeData();
            const maxFeePerGas = feeData.maxFeePerGas?.mul(2) || ethers.utils.parseUnits('100', 'gwei');
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas?.mul(2) || ethers.utils.parseUnits('2', 'gwei');
            const transaction = await signedService.getCampaignDonation(uuid, 
                {   
                    gasLimit: gasLimit.add(10000),
                    maxFeePerGas: maxFeePerGas,
                    maxPriorityFeePerGas: maxPriorityFeePerGas
                });
            await transaction.wait();
            return true
        } else {
            console.log("Failed to obtain campaign factory contract or provider.");
            return false;
        }
    } catch (error) {
        console.log("Failed to get owner funding from campaign ", uuid, " with error: ", error);
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