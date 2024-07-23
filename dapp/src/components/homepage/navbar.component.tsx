import React from 'react'
import Logo from '../shared/Logo.component'
import AuthUser from '../auth/auth.component'

const Navbar = () => {
    return (
        <nav className="z-10 bg-gradient-to-r from-gray-50 to-gray-300 navbar pt-1 pb-1 bg-base-100 border-gray-600 border w-full rounded-full shadow-lg z-3">
            <div className="flex-1 text-3xl">
                <Logo href='/'/>
            </div>
            <AuthUser />
        </nav>
    )
}

export default Navbar