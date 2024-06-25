import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "../../getusersession";
import { scanCampaignsAndInsertToDb } from "@/services/controller/scan/campaign.scan";

async function updateCampaignsInDb(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        await scanCampaignsAndInsertToDb();
        return NextResponse.json({message: "update succssfully"}, { status: 200 });
    } catch (error) {
        console.error("Error handling updateCampaignsInDb:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { updateCampaignsInDb as GET };