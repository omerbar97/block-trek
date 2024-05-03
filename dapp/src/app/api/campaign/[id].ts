import { NextRequest, NextResponse } from "next/server";


export default async function handler(req: NextRequest, res: NextResponse) {
    console.log("asdasd");
    
    const { id } = req;
    
    try {
        // Perform your API logic here
        
        
        // Send a JSON response with the fetched user data
        res.json({message: "asdasd"});
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}