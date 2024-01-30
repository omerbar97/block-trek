import React from 'react'
import { useWallet } from '@/hooks/wallet.hook';
import { ethers } from 'ethers';
import { BrowserProvider } from 'ethers';
import { Button } from '../ui/button';

// To remove the error causing by window.ethereum
declare global {
    interface Window {
        ethereum: any;
    }
}

const ConnectWallet = () => {

    const { setWalletAddress, setEthValue, walletAddress } = useWallet()

    const handleConnect = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum, "any")
            await provider.send("eth_requestAccounts", []);
            await handleSigner(provider)
        } catch(e){
            console.log("failed to connect to a wallet")
        }
    }

    const handleSigner = async (provider: BrowserProvider) => {
        const signer = provider.getSigner();
        const address = (await signer).address
        setWalletAddress(address)
        // Retrieve the balance

        const balance = await provider.getBalance(address);
        if (balance !== undefined) {
            // Convert the balance to ETH (wei to ether)
            const formattedBalance = ethers.formatEther(balance)
            setEthValue(formattedBalance);
        } else {
            // Handle the case where balance is undefined
            console.error('Balance is undefined');
        }
    }

    return (
        <>
            {walletAddress ?
                <div>
                    <Button size='sm' variant='connected' className='rounded-2xl' onClick={handleConnect}>Connected</Button>
                </div>
                :
                <div>
                    <Button size='sm' variant='destructive' className='rounded-2xl' onClick={handleConnect}>Connect Wallet</Button>
                </div>
            }
        </>

    )
}

export default ConnectWallet