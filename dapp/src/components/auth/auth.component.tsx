'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';

const AuthUser = () => {

    const { data: session, status } = useSession()

    const authenticated = () => {

        const imageHandle = () => {
            return (
                <div className='w-10 rounded-full'>
                    <Avatar>
                        <AvatarImage src={session?.user?.image ? session?.user?.image : undefined} />
                        <AvatarFallback>BT</AvatarFallback>
                    </Avatar>
                </div>
            )
        }

        const downMenuHandle = () => {
            return (
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-white">
                    <li>
                        <Link href='/dashboard'>
                            <p className="justify-between">
                                Dashboard
                            </p>
                        </Link>
                    </li>
                    <li onClick={() => signOut()}><a>Logout</a></li>
                </ul>
            )
        }

        return (
            <>
                <div className='text-black font-mono'>
                    {/* Welcome! <span className=''>{session?.user?.name}</span> */}
                </div>
                <div className="dropdown dropdown-end  items-center">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        {imageHandle()}
                    </div>
                    {downMenuHandle()}
                </div>
            </>
        )
    }

    const unAuthenticated = () => {
        return (
            <div className='rounded-full'>
                <Button variant='default' className='rounded-full' onClick={() => signIn()}>
                    Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className="flex mr-4">
            {status === 'authenticated' ?
                <>
                    {authenticated()}
                </> :
                <>
                    {unAuthenticated()}
                </>}
        </div>
    )
}

export default AuthUser