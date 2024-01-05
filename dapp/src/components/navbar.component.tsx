import React from 'react'
import AppLogo from '@/assets/logo'
import Link from 'next/link';
import Auth from './shared/auth.component';

const Navbar = () => {

    const logo = (outline: string, bold: string) => {
        return (
            <div className="flex">
                <Link href='/' className="flex btn-ghost rounded-full p-2">
                    <AppLogo size={42} className='ml-5 mr-5' />{outline} <span className="font-bold">{bold}</span>
                </Link>
            </div>
        );
    };


    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-300 navbar bg-base-100 border-gray-600 border w-full rounded-full shadow-lg">
            <div className="flex-1 text-3xl">
                {logo("Block", "Trek")}
            </div>
            <Auth />
        </div>
    )
}

export default Navbar