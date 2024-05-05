// model Owner {
//     walletAddress String     @id(map: "wallet_address")
//     email         String
//     campaigns     Campaign[]
//   }

import prisma from "@/lib/prisma"
import { Campaign, Owner } from "@prisma/client"

export async function createOwner(walletAddress:string, email: string) {
    try{
        const isExists = await getOwnerByWalletAddress(walletAddress)
        if (isExists) {
            throw new Error("the owner of public address wallet: " + walletAddress + " already exists")
        }
        await prisma.owner.create({
            data: {
                walletAddress: walletAddress,
                email: email
            }
        })
        return true
    } catch(e) {
        console.log("create campaign owner failed ", e)
        return false
    }
}

export async function getOwnerByWalletAddress(walletAddress: string): Promise<Owner | null> {
    try {
        const user = prisma.owner.findFirst({
            where: {
                walletAddress: walletAddress
            }
        })
        return user
    } catch(e) {
        console.log("failed to read user ", e)
        return null
    }
}

export async function updateOwnerCampaigns(walletAddress: string, campagin: Campaign) {
    try {
        const user = await prisma.owner.findFirst({
                where: {
                    walletAddress: walletAddress
                }, include: {
                    campaigns: true
                }
        })
        if (!user) {
            throw new Error("user wallet address: " + walletAddress + " does not exists")
        }
        const updatedCampaigns = [...user.campaigns, campagin];

        await prisma.owner.update({
            where: {
                walletAddress: walletAddress
            },
            data: {
                campaigns: {
                    create: updatedCampaigns,
                },
            }
        })
        return true
    } catch(e) {
        console.log("failed to update owners campaigns ", e)
        return false
    }
}