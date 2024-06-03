import { parseEther, formatEther } from "ethers"


export const formatEtherFromString = (balance: string) => {
    return formatEther(balance)
}

export const pasreEtherFromStringEtherToWEI = (balance: string) => {
    return parseEther(balance)
}