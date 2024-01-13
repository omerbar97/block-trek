import React from 'react'
import AuthUser from './shared/auth.component';
import Logo from './shared/Logo.component';

const Navbar = () => {
    return (
        <div className="z-10 bg-gradient-to-r from-gray-50 to-gray-300 navbar pt-1 pb-1 bg-base-100 border-gray-600 border w-full rounded-full shadow-lg">
            <div className="flex-1 text-3xl">
                <Logo href='/'/>
            </div>
            <AuthUser />
        </div>
    )
}

export default Navbar