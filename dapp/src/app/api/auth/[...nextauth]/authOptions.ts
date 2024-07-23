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
                return false; // No profile email, return false
            }

            // checking if user already signed up
            try {
                const foundUser = await prisma.user.findFirst({
                    where: {
                        email: profile.email,
                    },
                });

                if (!foundUser) {
                    // user doesn't exist, create a new one
                    const usr: User = {
                        email: profile.email,
                        name: profile.name,
                        avatar: profile.image,
                        verified: false,
                        filledForm: false,
                    };
                    await prisma.user.create({
                        data: {
                            ...usr,
                        },
                    });
                } else if (!foundUser.filledForm) {
                    // user exists but hasn't filled form
                    return true; // Allow sign-in
                } else {
                    // update existing user
                    await prisma.user.update({
                        where: {
                            email: profile.email,
                        },
                        data: {
                            name: profile.name,
                            avatar: profile.image,
                        },
                    });
                }

                return true; // Sign-in successful
            } catch (e) {
                console.log("failed to auth user login ", e);
                return false; // Sign-in failed
            }
        },
    },
};