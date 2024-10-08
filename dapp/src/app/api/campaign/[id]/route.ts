import { getCampaignByIdWithAllData } from "@/services/controller/campaign";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "../../getusersession";


async function handler(req: NextRequest, params: any) {
    // Getting params of campagin by id params.id
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    const id = params.params.id as string
    if (id == "dummy") {
        return NextResponse.json("", { status: 200 });
    }
    try {
        const idAsNum = parseInt(id, 10) as number
        const res = await getCampaignByIdWithAllData(idAsNum)
        if (!res) {
            return NextResponse.json({message: "campaign " + id + " doesn't exists"}, { status: 404 });
        }
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        const s = 'Error fetching user data:' + error
        console.error(s);
        return NextResponse.json({message: s}, { status: 500 });
    }
}

export { handler as GET };
