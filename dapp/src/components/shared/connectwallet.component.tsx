import React from 'react'
import { useWallet } from '@/hooks/wallet.hook';
import { ethers } from 'ethers';
import CustomBtn from './customBtn.component';
import { BrowserProvider } from 'ethers';
import { Button } from '../ui/button';

const ConnectWallet = () => {

    const { setWalletAddress, setEthValue, walletAddress } = useWallet()

    const handleConnect = async () => {
        const provider = new BrowserProvider(window.ethereum, "any")
        let accounts = await provider.send("eth_requestAccounts", []);
        handleSigner(provider)
    }

    const handleSigner = async (provider: BrowserProvider) => {
        const signer = provider.getSigner();
        const address = (await signer).address
        setWalletAddress(address)
        // Retrieve the balance

        const balance = await provider.getBalance(address);
        if (balance !== undefined) {
            // Convert the balance to ETH (wei to ether)
            console.log(ethers)
            const formattedBalance = ethers.formatEther(balance)
            setEthValue(formattedBalance);
        } else {
            // Handle the case where balance is undefined
            console.error('Balance is undefined');
        }
    }

    return (
        <>
            {walletAddress ? <>
                <div>
                    <Button size='lg' variant='ghost' className='rounded-2xl' onClick={handleConnect}>Connected</Button>
                </div>
            </> : <>
                <div>
                    <Button size='lg' variant='destructive' className='rounded-2xl' onClick={handleConnect}>Connect Wallet</Button>
                </div>
            </>}
        </>

    )
}

export default ConnectWallet