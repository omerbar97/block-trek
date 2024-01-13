'use client';
import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react'
import CustomBtn from './shared/customBtn.component'

const SigninBtn = () => {

    const { data: session } = useSession()
    const router = useRouter();

    useEffect(() => {
        if (session && session.user) {
          router.push(`/`);
        }
      }, [session, router])

    if (session && session.user) {
        return (
            <>
                <div className='flex gap-4 items-center ml-auto'>
                    <h4 className='text-gray-800 text-center font-bold font-sans'>Welcome! {session.user.name}</h4>
                    {session.user.image ?
                        <>
                            <CustomBtn onclick={() => signOut()} content="Sign Out" image={session.user.image} />
                        </>
                        :
                        <>
                            <CustomBtn onclick={() => signOut()} content="Sign Out" />
                        </>}

                </div>
            </>
        )
    }
    return (
        <>
            <div className='flex gap-4 ml-auto'>
                <CustomBtn onclick={() => signIn()} content="Sign In" />
            </div>
        </>
    )
}

export default SigninBtn