'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import AppLogo from '@/assets/logo'

const WalletCard = () => {

    const { data: session } = useSession()

    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState("");
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);

            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    accountChangedHandler(newProvider.getSigner());
                } else {
                    setDefaultAccount(null);
                    setUserBalance("");
                }
            });
        } else {
            setErrorMessage("Please Install Metamask!!!");
        }
    }, []);

    const connectWalletHandler = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            setErrorMessage("User denied account access");
        }
    }

    const accountChangedHandler = async (newAccount) => {
        const address = await newAccount.getAddress();
        setDefaultAccount(address);
        const balance = await newAccount.getBalance();
        setUserBalance(ethers.utils.formatEther(balance));
    }

    const card = () => {
        return (
            <div className="relative m-auto h-48 w-80 rounded-xl bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-2xl transition-transform sm:h-56 sm:w-96 sm:hover:scale-110">
                <div className="absolute top-4 w-full px-8 sm:top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light">Name</p>
                            <p className="font-medium tracking-widest">{session?.user?.name}</p>
                        </div>
                        <img
                            className="h-14 w-14 object-contain"
                            src={AppLogo}
                        />
                    </div>
                    <div className="pt-1">
                        <p className="font-light">Account Number</p>
                        <p className="tracking-more-wider font-medium">Wallet number</p>
                    </div>
                    <div className="pt-4 pr-6 sm:pt-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="text-xs font-light">Etheruim</p>
                                <p className="text-base font-medium tracking-widest">{userBalance}</p>
                            </div>
                            <div className="">
                                <p className="text-xs font-light">Usd</p>
                                <p className="text-base font-medium tracking-widest">03/25</p>
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
                onClick={connectWalletHandler}>
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
