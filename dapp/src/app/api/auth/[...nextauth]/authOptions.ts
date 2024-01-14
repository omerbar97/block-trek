// app/api/auth/[...nextauth]/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import prisma from "@/lib/prisma";
import { User } from "@/types/user.interface";

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
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                throw new Error('No profile')
            }

            // checking if user already signed up
            const foundUser = await prisma.user.findFirst({
                where: {
                    email: profile.email
                }
            })

            if (!foundUser) {
                // user doesnt exists
                const usr: User = {
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.image,
                    verified: false,
                    filledForm: false,
                }
                await prisma.user.create({
                    data: {
                        ...usr
                    }
                })
                return { user: { ...usr } };
            }
            else if (!foundUser.filledForm) {
                return { user: { ...foundUser } };
            } else {
                await prisma.user.update({
                    where: {
                        email: profile.email,
                    },
                    data: {
                        name: profile.name,
                        avatar: profile.image,
                    }
                })
            }
            return { user: { ...foundUser } };
        },
    },
};