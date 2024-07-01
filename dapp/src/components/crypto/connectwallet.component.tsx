'use client';
import React, { useEffect } from 'react'
import { useWallet } from '@/hooks/wallet.hook';
import { Button } from '../ui/button';
import { connectMetamaskWallet } from '@/services/crypto/wallet';
import { failedToConnectToMetamaskWalletToast, genericToast, successToConnectToMetamaskWalletToast, waitingForSessionToBeResolvedToast } from '@/utils/toast';
import { useSession } from 'next-auth/react';

// To remove the error causing by window.ethereum
declare global {
    interface Window {
        ethereum: any;
    }
}

const ConnectWalletCM = () => {

    const { setWalletAddress, setEthValue, walletAddress } = useWallet()
    const { data: session, status } = useSession()

    useEffect(() => {
        const wallet = sessionStorage.getItem('walletAddress')
        const value = sessionStorage.getItem('ethValue')
        setWalletAddress(wallet)
        setEthValue(value)
    }, [])

    const handleConnect = async () => {
        // if (walletAddress !== null) {
        //     genericToast("Wallet is already connected", "To wallet: " + walletAddress)
        //     return
        // }
        if (status === "authenticated") {
            const result = await connectMetamaskWallet()
            if (result.provider === null || result.walletAddress === null || result.walletValue === null) {
                // failed toast message
                failedToConnectToMetamaskWalletToast()
                genericToast("Failure", result.message)
                return
            }
            await handleSigner(result.walletAddress, result.walletValue)
        } else if (status === "loading"){
            waitingForSessionToBeResolvedToast()
        }
    }

    const handleSigner = async (walletAddress: string, walletValue: string) => {
        setWalletAddress(walletAddress)
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
                    <Button size='sm' variant='destructive' className='rounded-2xl' onClick={handleConnect}>Connect A Wallet</Button>
                </div>
            }
        </>

    )
}

export default ConnectWalletCM