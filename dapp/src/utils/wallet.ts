// import { useWallet } from "@/hooks/wallet.hook";
// import { ethers } from "ethers";
// import React from 'react';

// // Define a function with React.MouseEventHandler<HTMLButtonElement> type
// export const handleBtnConnect: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//     let accounts = await provider.send("eth_requestAccounts", []);
//     let account = accounts[0];
//     provider.on('accountsChanged', (accounts) => {
//         account = accounts[0]
//         console.log("user changed the account of the metamask", accounts)
//     })
//     let { setWalletAddress } = useWallet()
//     const signer = provider.getSigner();
//     const address = await signer.getAddress();
//     console.log(address)
//     // setWalletAddress(address)
// };

import { useWallet } from "@/hooks/wallet.hook";
import { Web3Provider } from "@ethersproject/providers";  // Import Web3Provider from ethers/providers
import React from 'react';

// Define a function with React.MouseEventHandler<HTMLButtonElement> type
export const handleBtnConnect: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    const provider = new Web3Provider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    provider.on('accountsChanged', (accounts) => {
        account = accounts[0]
        console.log("user changed the account of the metamask", accounts)
    })
    let { setWalletAddress } = useWallet()
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log(address)
    setWalletAddress(address)
};
