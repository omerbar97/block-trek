'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SiBlockchaindotcom } from "react-icons/si";
import { useWallet } from '@/hooks/wallet.hook';

const defaultAccountAddress = 'Connect an account'
const defaultEthValue = "0.0"

const WalletCard = () => {

    const { data: session } = useSession()
    const { walletAddress, ethValue } = useWallet();

    const [defaultAccount, setDefaultAccount] = useState(walletAddress ? walletAddress : defaultAccountAddress);
    const [userBalance, setUserBalance] = useState(ethValue ? ethValue : defaultEthValue);


    useEffect(() => {
        if (!walletAddress) {
            setDefaultAccount(defaultAccountAddress);
        } else {
            // triming the 20 digits of the wallet
            let val = walletAddress.slice(0, 28);
            val = val + "..."
            setDefaultAccount(val)
        }

        if (!ethValue) {
            setUserBalance(defaultEthValue)
        } else {
            setUserBalance(ethValue)
        }
    }, [walletAddress, ethValue])

    return (
        <div className="WalletCard">
            <div className="relative m-2 h-48 w-80 rounded-xl bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-2xl transition-transform sm:h-56 sm:w-96 sm:hover:scale-105">
                <div className="absolute top-4 w-full px-8 sm:top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-bold">NAME</p>
                            <p className="font-light tracking-widest">{session?.user?.name}</p>
                        </div>
                        <SiBlockchaindotcom className='h-14 w-14 object-contain text-black' />
                    </div>
                    <div className="pt-1">
                        <p className="font-bold">ACCOUNT NUMBER</p>
                        <p className="tracking-more-wider font-light">{defaultAccount}</p>
                    </div>
                    <div className="pt-4 pr-6 sm:pt-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="text-xs font-bold">ETHERUIM BALANCE</p>
                                <p className="text-base font-light tracking-widest">{userBalance}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletCard;
