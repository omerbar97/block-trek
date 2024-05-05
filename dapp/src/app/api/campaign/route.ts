// pages/api/createContract.ts
import { getBlockChainContract, getNewContractAddress } from '@/services/crypto/contract';
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getUserSession } from '../getusersession';
import { createCampaign, getAllCampaignsFromDb } from '@/services/controller/campaign';


async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        const res = await createCampaign(data)
        console.log(res)
        return NextResponse.json({ message: 'Campaign created successfully' }, {status: 200})
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ message: "Error creating contract: " + error }, {status: 400})
    }
}

async function getHandler(req: NextApiRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const allCampaigns = await getAllCampaignsFromDb()
        return NextResponse.json(allCampaigns, { status: 200 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { postHandler as POST, getHandler as GET};
