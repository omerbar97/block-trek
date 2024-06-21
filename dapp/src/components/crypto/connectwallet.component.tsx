'use client';
import React from 'react'
import { useWallet } from '@/hooks/wallet.hook';
import { Button } from '../ui/button';
import { connectMetamaskWallet } from '@/services/crypto/wallet';
import { failedToConnectToMetamaskWalletToast, genericToast, successToConnectToMetamaskWalletToast, waitingForSessionToBeResolvedToast } from '@/utils/toast';
import { useSession } from 'next-auth/react';
import { formatEtherFromString } from '@/services/crypto/utils';
import { ConnectWallet as connectWalletFunc, useAddress } from "@thirdweb-dev/react";


// To remove the error causing by window.ethereum
declare global {
    interface Window {
        ethereum: any;
    }
}

const ConnectWallet = () => {

    const { setWalletAddress, setEthValue, walletAddress } = useWallet()
    const { data: session, status } = useSession()
    const address = useAddress()
    setWalletAddress(address ?? null)


    const handleConnect = async () => {
        if (walletAddress !== null) {
            genericToast("Wallet is already connected", "To wallet: " + walletAddress)
            return
        }
        if (status === "authenticated") {
            const result = await connectMetamaskWallet()
            if (result.provider === null || result.walletAddress === null || result.walletValue === null) {
                // failed toast message
                failedToConnectToMetamaskWalletToast()
                genericToast("Failure", result.message)
                return
            }
            successToConnectToMetamaskWalletToast()
            genericToast("Success", result.message)
            await handleSigner(result.walletAddress, result.walletValue)
        } else if (status === "loading"){
            waitingForSessionToBeResolvedToast()
        }
    }

    const handleSigner = async (walletAddress: string, walletValue: string) => {
        setWalletAddress(walletAddress)
        // formatEtherFromString(walletValue)
        // const formattedBalance = ethers.utils.formatEther(walletValue)
        setEthValue(walletValue);
        genericToast("Amount of ethereum on this account: " + walletValue, "Nice!")
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