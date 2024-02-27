import { ethers } from 'ethers';
import fs from 'fs'

export async function getNewContractAddress(transactionHash: string) {
    const provider = new ethers.JsonRpcProvider(); // You may need to specify your provider URL
    const transactionReceipt = await provider.waitForTransaction(transactionHash);

    // Now, you can access the contract address from the transaction receipt
    const contractAddress = transactionReceipt?.contractAddress;
    return contractAddress
}


async function generateABI(filePath: string) {
    // Read the compiled contract JSON file
    const compiledContract = JSON.parse(fs.readFileSync(filePath).toString());

    // Extract the ABI definition from the compiled contract
    const abi = compiledContract.abi;

    const json = JSON.stringify(abi)

    return json
}

export const getBlockChainContract = async () => {
    const provider = await new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer = await provider.getSigner()
    const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS as string
    const abi = await generateABI(process.env.CONTRACT_JSON_ABI_PATH as string)
    const campaignFactoryContract = await new ethers.Contract(contractAddress, abi, signer);
    return campaignFactoryContract
}



