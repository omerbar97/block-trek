import { BrowserProvider } from "ethers";
import { createOwner, getOwnerByWalletAddress } from "../controller/owner";
import { useAxiosPost } from "@/hooks/useAxios.hook";
import axios from "axios";

export async function connectMetamaskWallet() : Promise<BrowserProvider | null>{
    try {
        const provider = new BrowserProvider(window.ethereum, "any")
        await provider.send("eth_requestAccounts", [])

        // Creating this owner attached to this user
        const signer = provider.getSigner();
        const address = (await signer).address
        const data = {
            walletAddress: address
        }

        const result = await axios.post('/api/owner/auth', data)
        if (result.status !== 200) {
            // failed
            throw new Error(result.data.message)
        }
        return provider
    } catch (e) {
        console.log("failed to connect to the metamask account ", e)
        return null
    }
}
