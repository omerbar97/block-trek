import { BrowserProvider } from "ethers";
import axios from "axios";


export async function connectMetamaskWallet() : Promise<{provider: BrowserProvider | null, message: string}>{
    try {
        const provider = new BrowserProvider(window.ethereum, "any")
        await provider.send("eth_requestAccounts", [])

        // Creating this owner attached to this user
        const signer = provider.getSigner();
        const address = (await signer).address
        const data = {
            walletAddress: address
        }
        const result = await axios.post('/api/owner', data)
        if (result.status !== 200) {
            // failed
            throw new Error(result.data.message)
        }
        var d = {
            provider: provider,
            message: result.data.message
        }
        return d
    } catch (e) {
        console.log("failed to connect to the metamask account ", e)
        var s = {
            provider: null,
            message: e as string
        }
        return s
    }
}


export async function getProviders() : Promise<BrowserProvider | null>{
    try {
        const provider = new BrowserProvider(window.ethereum, "any")
        await provider.send("eth_requestAccounts", [])
        return provider
    } catch (error) {
        console.log("Failed to get providers: ", error)
        return null
    }
}

