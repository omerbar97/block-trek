'use client';
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import TypewriterComponent from 'typewriter-effect';

const Hero = () => {

    const scrollToAboutSection = () => {
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const { data: session } = useSession()
    var url = session?.user?.email ? '/dashboard' : '/api/auth/signin'
    const welcomeSection = () => {
        return (
            <div className="text-white">
                <div className="mx-auto max-w-2xl py-32 sm:py-40 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-50 ring-1 ring-gray-100/10 hover:ring-gray-200">
                            About our platfrom.{" "}
                            <Link href="#" onClick={scrollToAboutSection}>
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
                        <div className="mt-6 text-lg leading-8 text-gray-400 font-mono">
                            <TypewriterComponent options={{
                                strings: ["Explore and fund the future with Block-Trek. Your decentralized crowdfunding hub on the Ethereum blockchain. Empowering innovators, connecting backers, and driving change. Join us in shaping tomorrow's success stories.",
                                    "So, What are you waiting for?",
                                    "Why you are not in the dashboard?",
                                    "With great power comes great responsability's...",
                                    "I am just a cursor...",
                                    "I am new here as well...",
                                ],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                                deleteSpeed: 4,
                            }} />
                        </div>
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
        <section className='left-0 top-0 hero overflow-hidden'>
            {welcomeSection()}
        </section>
    )
}

export default Hero