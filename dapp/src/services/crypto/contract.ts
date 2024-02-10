import { ethers } from 'ethers';

export const getBlockChainContract = async () => {
    const provider = await new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer = await provider.getSigner()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "ownerName",
                    "type": "string"
                },
                {
                    "name": "description",
                    "type": "string"
                },
                {
                    "name": "endDate",
                    "type": "uint256"
                },
                {
                    "name": "goalAmount",
                    "type": "uint256"
                },
                {
                    "name": "campaignType",
                    "type": "uint256"
                }
            ],
            "name": "createCampaign",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getDeployedCampaigns",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "campaignAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "CampaignCreated",
            "type": "event"
        }
    ]; // Add your contract ABI here

    const campaignFactoryContract = await new ethers.Contract(contractAddress, abi, signer);
    return campaignFactoryContract
} 



