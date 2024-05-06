'use client';
import Link from 'next/link';
import React from 'react'

const About = () => {
    return (
        <section className="about-section text-white py-16" id="about-section">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                        About Our Platform
                    </h2>
                    <p className="text-lg leading-relaxed mb-8 py-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat urna ut felis
                        volutpat, eget dictum velit tincidunt. Mauris pulvinar justo id libero hendrerit, eget
                        elementum lorem condimentum. In consequat neque eget augue consequat, nec vulputate ex
                        feugiat. Phasellus a sem vitae nibh varius laoreet. Quisque malesuada, felis nec
                        consectetur ullamcorper, enim eros convallis ex, non congue dui est id dui. Donec vel
                        interdum ante. Nulla consequat tellus eu sapien sagittis, vitae luctus justo consequat.
                    </p>
                    <div className='text-indigo-500 hover:text-indigo-400 font-semibold'>
                        Adding images here of the creator
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About