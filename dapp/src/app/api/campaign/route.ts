import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getUserSession } from '../getusersession';
import { createCampaign, deleteCampaignFromDb, getAllCampaignsFromDb, isCampaignContractAddressExists, updateCampaignInDbByUuid } from '@/services/controller/campaign';
import { CampaignCategory } from '@prisma/client';
import { scanSyncCampaignsFromDbToBlockchain } from '@/services/controller/scan/sync.scan';

async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        const res = await createCampaign(data)
        if (!res) {
            return NextResponse.json({message: "Failed to create campaign"}, {status: 400})
        }
        const response = {
            uuid: res
        }
        return NextResponse.json(response, {status: 200})
    } catch (error) {
        console.error("Error creating contract:", error);
        return NextResponse.json({ message: "Error creating contract: " + error }, {status: 400})
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
        const uuid = data.campaginUuid
        await scanSyncCampaignsFromDbToBlockchain(uuid)
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

        const name = req.nextUrl.searchParams.get("name")
        const category = req.nextUrl.searchParams.get("category")
        const experation = req.nextUrl.searchParams.get("experation")
        const n_name = typeof name === 'string' ? name : (Array.isArray(name) ? name[0] : null);
        const n_category = typeof category === 'string' ? category : (Array.isArray(category) ? category[0] : null);
        const n_expiration = typeof experation === 'string' ? experation : (Array.isArray(experation) ? experation[0] : null);

        // Your logic using query parameters
        const allCampaigns = await getAllCampaignsFromDb(n_name, n_category as CampaignCategory, n_expiration);
        return NextResponse.json(allCampaigns, { status: 200 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { postHandler as POST, getHandler as GET, putHandler as PUT, deleteHandler as DELETE};
