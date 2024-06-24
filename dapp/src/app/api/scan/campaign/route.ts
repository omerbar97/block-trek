import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "../../getusersession";
import { scanCampaignsAndInsertToDb } from "@/services/controller/scan/campaign.scan";

async function updateCampaignsInDb(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        console.log("test")
        await scanCampaignsAndInsertToDb();
        // reading all campaign from database and checking updating information
        return NextResponse.json({message: "update succssfully"}, { status: 401 });
    } catch (error) {
        console.error("Error handling updateCampaignsInDb:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { updateCampaignsInDb as GET };