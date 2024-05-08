import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getUserSession } from '../getusersession';
import { createCampaign, getAllCampaignsFromDb } from '@/services/controller/campaign';
import { CampaignCategory } from '@prisma/client';


async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        console.log(data)
        // const res = await createCampaign(data)
        // console.log(res)
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

export { postHandler as POST, getHandler as GET};
