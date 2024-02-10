// pages/api/createContract.ts
import { getBlockChainContract } from '@/services/crypto/contract';
import { NextResponse } from 'next/server';


async function handler(request: Request){
    try {
        // Extract necessary data from request body
        const { ownerName, description, endDate, goalAmount, campaignType } = request.body;
        
        const service = await getBlockChainContract()
        // const daiContract = service.connect(ethers)

        // Call the contract's createCampaign function
        await service.createCampaign(ownerName, description, endDate, goalAmount, campaignType);

        return NextResponse.json({message: 'Campaign created successfully'}, {status: 200})
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({message: 'Failed to create contract'}, {status: 500})
    }
}

export {handler as POST}