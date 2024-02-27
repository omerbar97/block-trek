// pages/api/createContract.ts
import { getBlockChainContract, getNewContractAddress } from '@/services/crypto/contract';
import { NextResponse } from 'next/server';


async function postHandler(request: Request){
    try {
        // Extract necessary data from request body
        const { ownerName, description, endDate, goalAmount, campaignType } = await request.json() 
        const service = await getBlockChainContract()

        // Call the contract's createCampaign function
        const res = await service.createCampaign(ownerName, description, endDate, goalAmount, campaignType);
        console.log(res)
        // const contractAddress = await getNewContractAddress(res.hash)

        // console.log(contractAddress)

        return NextResponse.json({message: 'Campaign created successfully'}, {status: 200})
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({message: 'Failed to create contract'}, {status: 500})
    }
}

async function getHandler(request: Request) {
    try {
        const service = await getBlockChainContract()

        const lst = await service.getDeployedCampaigns()

        console.log(lst)

        return NextResponse.json({ message: 'GET request handled successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: 'Failed to handle GET request' }, { status: 500 });
    }
}

export { postHandler as POST, getHandler as GET };
