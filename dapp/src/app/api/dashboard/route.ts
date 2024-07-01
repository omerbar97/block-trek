import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '../getusersession';
import { getNumberOfCampaignsThatFailedFromDb, getNumberOfCampaignsThatOnGoingFromDb, getNumberOfCampaignsThatWereSuccssfullyFromDb, getTotalNumberOfCampaignsFromDb } from '@/services/controller/dashboard';

async function getHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = {
            total: await getTotalNumberOfCampaignsFromDb(),
            ongoing: await getNumberOfCampaignsThatOnGoingFromDb(),
            failed: await getNumberOfCampaignsThatFailedFromDb(),
            succssfully: await getNumberOfCampaignsThatWereSuccssfullyFromDb()
        }
        return NextResponse.json(data, {status: 200})   
    } catch (error) {
        console.error("Error deleting contract:", error);
        return NextResponse.json({ message: "Error deleting contract: " + error }, {status: 400})
    }
}

export { getHandler as GET};
