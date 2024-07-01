import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '../getusersession';
import { getAllCampaignsFromDb, updateCampaignInDbByUuid } from '@/services/controller/campaign';
import { CampaignCategory } from '@prisma/client';
import { scanSyncCampaignsFromDbToBlockchain } from '@/services/controller/scan/sync.scan';
import { handleCampaignsAndInsertToDb } from '@/services/controller/scan/campaign.scan';
import { getCampaignContributions } from '@/services/controller/contributers';

async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        await handleCampaignsAndInsertToDb(data.campaignUuid)
        return NextResponse.json({"message":"update succssfully"}, {status: 200})
    } catch (error) {
        console.error("Error updating contribution on contract: ", error);
        return NextResponse.json({ message: "Error updating contribution on contract: " + error }, {status: 400})
    }
}

async function deleteHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        // Need to add logic to check if campaign exists in contract
        const data = await req.json()
        await scanSyncCampaignsFromDbToBlockchain(data.campaginUuid)
        return NextResponse.json({message: "deleted the campaign succssfully"}, {status: 200})   
    } catch (error) {
        console.error("Error deleting contract:", error);
        return NextResponse.json({ message: "Error deleting contract: " + error }, {status: 400})
    }
}

async function putHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        const res = await updateCampaignInDbByUuid(data.uuid, data)
        if (!res) {
            return NextResponse.json({ message: 'Failed to save campaign' }, {status: 500})
        }
        return NextResponse.json({ message: 'Campaign created successfully' }, {status: 200})
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ message: "Error creating contract: " + error }, {status: 400})
    }
}

async function getHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {

        const walletAddress = req.nextUrl.searchParams.get("walletAddress")
        // Your logic using query parameters
        if (walletAddress === null) {
            return NextResponse.json({message: "No wallet address was given"}, { status: 400 });
        }
        const data = await getCampaignContributions(walletAddress)
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { postHandler as POST, getHandler as GET, putHandler as PUT, deleteHandler as DELETE};
