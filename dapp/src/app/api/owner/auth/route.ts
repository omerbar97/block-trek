import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "../../getusersession";
import { createOwner, getOwnerByWalletAddress } from "@/services/controller/owner";


async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json() as {walletAddress: string}
        const owner = await getOwnerByWalletAddress(data.walletAddress)
        if (!owner) {
            // Owner doesn't exists, creating a new one
            const ok = await createOwner(data.walletAddress, session.user.email)
            if (!ok) {
                return NextResponse.json({ message: 'Failed to create owner' }, {status: 500})
            } else {
                return NextResponse.json({ message: 'Created owner successfully' }, {status: 200})
            }
        } else if (owner.email !== session.user.email) {
            // cannot use this public address with this given email
            return NextResponse.json({ message: 'This public wallet address is already use with a different account' }, {status: 400})
        }
        return NextResponse.json({ message: 'Owner already exists and is valid' }, {status: 200})
    } catch (error) {
        console.error("Error creating owner:", error);
        return NextResponse.json({ message: "Error creating owner: " + error }, {status: 400})
    }
}

export { postHandler as POST};