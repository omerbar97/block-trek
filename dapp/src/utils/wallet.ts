import { ethers } from "ethers"


export const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
        console.log(address); // Print new address
    });

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log(address);
}

export const changeWallet = async () => {

}