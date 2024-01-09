'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import { SiBlockchaindotcom } from "react-icons/si";
import { connectWallet } from '@/utils/wallet';


const WalletCard = () => {

    const { data: session } = useSession()

    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("Connect an account");
    const [userBalance, setUserBalance] = useState("0.0");
    const [provider, setProvider] = useState(null);


    const card = () => {
        return (
            <div className="relative m-auto h-48 w-80 rounded-xl bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-2xl transition-transform sm:h-56 sm:w-96 sm:hover:scale-110">
                <div className="absolute top-4 w-full px-8 sm:top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light">Name</p>
                            <p className="font-medium tracking-widest">{session?.user?.name}</p>
                        </div>
                        <SiBlockchaindotcom className='h-14 w-14 object-contain text-black' />
                    </div>
                    <div className="pt-1">
                        <p className="font-light">Account Number</p>
                        <p className="tracking-more-wider font-medium">{defaultAccount}</p>
                    </div>
                    <div className="pt-4 pr-6 sm:pt-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="text-xs font-light">ETHERUIM</p>
                                <p className="text-base font-medium tracking-widest">{userBalance}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="WalletCard">
            {card()}
            <img src="" className="App-logo" alt="logo" />
            <h3 className="h4">
                Welcome to a decentralized Application
            </h3>
            <button
                style={{ background: defaultAccount ? "#A5CC82" : "white" }}
                onClick={() => connectWallet()}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </button>
            <div className="displayAccount">
                <h4 className="walletAddress">Address:{defaultAccount}</h4>
                <div className="balanceDisplay">
                    <h3>
                        Wallet Amount: {userBalance}
                    </h3>
                </div>
            </div>
            {errorMessage}
        </div>
    );
}

export default WalletCard;
