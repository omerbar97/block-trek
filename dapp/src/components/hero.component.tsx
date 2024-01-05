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
            <div className="relative isolate px-6 pt-14 lg:px-8 text-white">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>
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
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src="" className="max-w-sm rounded-lg shadow-2xl" />
                {welcomeSection()}
            </div>
        </div>
    )
}

export default Hero