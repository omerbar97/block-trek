import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/authOptions";


export async function getUserSession() {
    try {
        const session = await getServerSession(authOptions)
        console.log(`got user session ${JSON.stringify(session)}`)
        return session
    } catch(error) {
        console.log("failed to get user session from getUserSession " + error)
        return null
    }
}