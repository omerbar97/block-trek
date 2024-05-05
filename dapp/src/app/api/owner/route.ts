// pages/api/createContract.ts
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getUserSession } from '../getusersession';
import { createOwner, getOwnerByWalletAddress } from '@/services/controller/owner';


async function postHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const data = await req.json()
        console.log(data)
        // const res = await createOwner()
        return NextResponse.json({ message: 'Created owner successfully' }, {status: 200})
    } catch (error) {
        console.error("Error creating owner:", error);
        return NextResponse.json({ message: "Error creating owner: " + error }, {status: 400})
    }
}

async function getHandler(req: NextRequest) {
    const session = await getUserSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "session not found" }, { status: 401 });
    }
    try {
        const owner = await getOwnerByWalletAddress()
        return NextResponse.json(owner, { status: 200 });
    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ message: "Error handling GET request: " + error }, { status: 500 });
    }
}

export { postHandler as POST, getHandler as GET};
