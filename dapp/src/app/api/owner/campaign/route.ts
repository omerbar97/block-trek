import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "../../getusersession";
import { getOwnerByWalletAddress } from "@/services/controller/owner";
import { getAllCampaignsFromDbForOwnerByWalletAddress } from "@/services/controller/campaign";

async function getHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = req.nextUrl.searchParams.get('walletAddress') as string
        const owner = await getOwnerByWalletAddress(data)
        if (data && owner && owner.email === session.user.email) {
            // getting all the campaign of that user
            const res = await getAllCampaignsFromDbForOwnerByWalletAddress(data)
            if (res !== null) {
                return NextResponse.json(res, { status: 200 });
            }
            return NextResponse.json({message: "Failed to retreive users campaigns"}, { status: 500 });
        }
        return NextResponse.json({message: "Owner doesn't match the session user"}, { status: 401 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { getHandler as GET };