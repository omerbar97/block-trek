'use client';
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import CustomBtn from './shared/customBtn.component'

const SigninBtn = () => {

    const { data: session } = useSession()

    if (session && session.user) {
        return (
            <>
                <div className='flex gap-4 ml-auto'>
                    <p className='text-sky-600'>{session.user.name}</p>
                    <CustomBtn onclick={() => signOut()} content="Sign Out" />
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