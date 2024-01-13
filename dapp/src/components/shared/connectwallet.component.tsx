import React from 'react'
import CustomBtn from './customBtn.component'
import { useWallet } from '@/hooks/wallet.hook';
import { ethers } from 'ethers';

const ConnectWallet = () => {

    const { setWalletAddress, setEthValue, walletAddress } = useWallet()

    const handleConnect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];
        provider.on('accountsChanged', async (accounts) => {
            account = accounts[0]
            console.log("user changed the account of the metamask", accounts)
            handleSigner(provider)
        })
        provider.on('disconnect', (error) => {
            console.log("wallet disconnected")
        })
        handleSigner(provider)
    }

    const handleSigner = async (provider: ethers.providers.Web3Provider) => {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address)
        // Retrieve the balance
        const balance = await provider.getBalance(address);
        // Convert the balance to ETH (wei to ether)
        const formattedBalance = ethers.utils.formatEther(balance);
        setEthValue(formattedBalance)
    }


    return (
        <>
            {walletAddress ? <>
                <div>
                    <CustomBtn className="ml-5" content="Connected" onclick={handleConnect} />
                </div>
            </> : <>
                <div>
                    <CustomBtn className="ml-5" content="Connect a Wallet" onclick={handleConnect} />
                </div>
            </>}
        </>

    )
}

export default ConnectWallet