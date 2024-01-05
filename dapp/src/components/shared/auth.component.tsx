'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'

const Auth = () => {

    const { data: session, status } = useSession()

    const authenticated = () => {

        const imageHandle = () => {
            return (
                <>
                    {
                        session?.user?.image ?
                            <>
                                <div className="w-10 rounded-full">
                                    <img alt="Tailwind CSS Navbar component" src={session?.user?.image} />
                                </div>
                            </> :
                            <>
                                <div className="w-10 rounded-full">
                                    <img alt="Tailwind CSS Navbar component" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRfV9n69zxuV4DQX7sYF7ql8ajx47wLioPeP-m4qFbHLkD9UNwfQSneRtkQEDnx-QxFs' />
                                </div>
                            </>
                    }
                </>
            )
        }

        const downMenuHandle = () => {
            return (
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                        <Link href='/dashboard'>
                            <p className="justify-between">
                                Dashboard
                            </p>
                            <span className="badge">New</span>
                        </Link>
                    </li>
                    <li onClick={() => signOut()}><a>Logout</a></li>
                </ul>
            )
        }

        return (
            <>
                <div className='text-black font-mono'>
                    Welcome! <span className='badge'>{session?.user?.name}</span>
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
                <button className='btn btn-ghost rounded-full'
                    onClick={() => signIn()}>Sign In</button>
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

export default Auth