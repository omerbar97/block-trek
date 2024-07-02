'use client';
import React from 'react';

const About = () => {
    return (
        <section className="about-section text-white py-16 bg-slate-900 mt-24 w-full rounded-badge mb-20" id="about-section">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                        About Our Platform
                    </h2>
                    <p className="text-lg leading-relaxed mb-2 py-8 font-mono">
                        Our platform leverages the power of the Ethereum blockchain to revolutionize crowdfunding. 
                        We provide a secure, transparent, and decentralized way to create and manage campaigns for raising funds. 
                        Whether you are an entrepreneur with a new idea, a creator seeking support, or a donor looking to contribute to exciting projects, 
                        our platform offers a robust solution.
                    </p>
                    <div className="text-indigo-500 hover:text-indigo-400 font-semibold mb-4">
                        Key Features:
                    </div>
                    <ul className="list-disc list-inside text-left mb-8 font-mono">
                        <li>Connecting to the Ethereum blockchain</li>
                        <li>Creating campaigns for crowd-funding</li>
                        <li>Donating to a campaign</li>
                        <li>Receiving a total refund if a campaign does not end successfully</li>
                    </ul>
                    <div className='text-indigo-500 hover:text-indigo-400 font-semibold'>
                        Join us in transforming the future of crowdfunding.
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
