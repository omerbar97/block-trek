import { utils } from "ethers"


export const formatEtherFromString = (balance: string) => {
    return utils.formatEther(balance)
}

export const pasreEtherFromStringEtherToWEI = (balance: string) => {
    return utils.parseEther(balance)
}