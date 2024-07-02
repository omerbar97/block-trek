import { ethers } from "ethers";
import axios from "axios";

export async function getWalletAddressByProvider(provider: ethers.providers.Web3Provider): Promise<string> {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address
}

export async function getWalletBalanceByProvider(provider: ethers.providers.Web3Provider): Promise<ethers.BigNumber> {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    return balance
}


export async function connectMetamaskWallet() : Promise<{
        provider: ethers.providers.Web3Provider | null,
        walletAddress: string | null,
        walletValue: string | null,
        message: string}>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        // Creating this owner attached to this user
        const address = await getWalletAddressByProvider(provider)
        const balance = await getWalletBalanceByProvider(provider)
        const balanceInEth = ethers.utils.formatEther(balance);

        const data = {
            walletAddress: address
        }
        const result = await axios.post('/api/owner', data)
        if (result.status !== 200) {
            throw new Error(result.data.message)
        }
        var d = {
            provider: provider,
            walletAddress: address,
            walletValue: balanceInEth,
            message: result?.data?.message
        }
        return d
    } catch (e) {
        console.log("failed to connect to the metamask account ", e)
        var s = {
            provider: null,
            walletAddress: null,
            walletValue: null,
            message: e as string
        }
        return s
    }
}


export async function getProviders() : Promise<ethers.providers.Web3Provider | null>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        return provider
    } catch (error) {
        console.log("Failed to get providers: ", error)
        return null
    }
}

