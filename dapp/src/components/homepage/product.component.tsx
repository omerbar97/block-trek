'use client';
import Image from 'next/image';
import React from 'react';

const ProductIntroduction = () => {
    return (
        <section className="product-intro-section text-white py-16 bg-slate-900 w-full rounded-badge" id="product-intro-section">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center lg:items-start">
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <Image 
                            src="/blockchain.png"
                            width={450}
                            height={450}
                            alt="Product Image"
                            className="shadow-lg rounded-full"
                            style={{ maxWidth: '100%', height: 'auto' }} // Ensuring the image is responsive
                        />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-8 mt-8 lg:mt-0 text-center lg:text-left">
                        <h2 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                            Introducing Our Revolutionary Product
                        </h2>
                        <p className="text-lg leading-relaxed mb-8 py-8 font-mono">
                            Our platform is designed to revolutionize crowdfunding through blockchain technology on the Ethereum network.
                            By leveraging the transparency, security, and decentralization of Ethereum, we provide a trustworthy and efficient 
                            way to launch and support innovative projects. Whether you're an entrepreneur, a creative, or an enthusiast, 
                            our product offers the perfect solution to raise funds, manage campaigns, and contribute to exciting ventures 
                            with confidence and ease.
                        </p>
                        {/* <div className="text-indigo-500 hover:text-indigo-400 font-semibold">
                            Learn more about our product's features and benefits below.
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductIntroduction;
