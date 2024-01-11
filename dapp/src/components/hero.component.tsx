'use client';
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const Hero = () => {

    const {data: session} = useSession()

    // when users are logged in the Get Started button will redirect to the dashboard
    var url = session?.user?.email ? '/dashboard' : '/api/auth/signin'

    const welcomeSection = () => {

        return (
            <div className="text-white">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-50 ring-1 ring-gray-100/10 hover:ring-gray-200">
                            About our platfrom.{" "}
                            <Link href="#">
                                <span className="font-semibold text-indigo-600">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Read more <span aria-hidden="true">→</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                            A Decentrilized App For Crowd Funding
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-400">
                            Explore and fund the future with Block-Trek. Your decentralized crowdfunding hub on the Ethereum blockchain. Empowering innovators, connecting backers, and driving change. Join us in shaping tomorrow's success stories.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href={url}>
                                <div
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {
                                        session?.user?.email ? 'Move to Dashboard' : 'Get started by signing'
                                    }
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`fixed left-0 top-0 hero min-h-screen bg-base-200 bg-secondImg bg-cover`}>
            <div className="">
                <img src="" className="" />
                {welcomeSection()}
            </div>
        </div>
    )
}

export default Hero