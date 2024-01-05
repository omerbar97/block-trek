// app/api/auth/[...nextauth]/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import prisma from "@/lib/prisma";

// Google provider
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID


// Next configure
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({ 
            clientId: `${GOOGLE_CLIENT_ID}`,
            clientSecret: `${GOOGLE_CLIENT_SECRET}`,
        }),
    ],
    secret: `${NEXTAUTH_SECRET}`,
    debug:true,
    callbacks: {
        async signIn({account, profile}) {
            if(!profile?.email) {
                throw new Error('No profile')
            }
            
            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.image,
                },
                update: {
                    name: profile.name,
                    avatar: profile.image,
                }
            })
            return true
        }
    },
};