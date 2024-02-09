'use client';
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
import dashboardMenu from "@/constants/dashboardMenu";
import Link from "next/link";
import Logo from "../shared/Logo.component";
import ConnectWallet from "../crypto/connectwallet.component";


const Sidebar = () => {
    const [nav, setNav] = useState(false);
    const pathname = usePathname();

    const smallLeftMenu = () => {
        // Returning the small menu on the left
        return (
            <ul className="hidden sm:flex flex-col text-gray-800 border border-gray-400 bg-gray-100 rounded-md">
                {dashboardMenu.map(({ icon, link }, index) => {
                    return (
                        <div key={index} className="py-3">
                            <Link href={link}>
                                <li
                                    className={`cursor-pointer w-[80%] rounded-lg mx-auto pl-1 ${pathname === link
                                        ? 'text-white bg-gray-600'
                                        : 'hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {icon}
                                </li>
                            </Link>
                        </div>
                    );
                })}
            </ul>
        )
    }

    const bigLeftMenu = () => {
        return (
            <>
                <AiOutlineClose
                    onClick={() => setNav(!nav)}
                    size={30}
                    className="absolute right-4 top-4 cursor-pointer"
                />
                <h2 className="text-3xl p-4">
                    <Logo href="/dashboard" />
                </h2>
                <nav>
                    <ul className="flex flex-col pl-4 pr-4 text-gray-800 border border-gray-300 bg-gray-100">

                        {dashboardMenu.map(({ title, icon, link }, index) => {
                            return (
                                <div key={index} className="py-2">
                                    <Link href={link} onClick={() => { setNav(false) }}>
                                        <li className={`text-xl flex cursor-pointer  w-[100%] rounded-full mx-auto p-2 ${pathname === link
                                            ? 'text-white bg-gray-600'
                                            : 'hover:text-white hover:bg-gray-800'
                                            }`}>
                                            {icon} <span className="ml-3">{title}</span>
                                        </li>
                                    </Link>
                                </div>
                            );
                        })}
                    </ul>
                </nav>
            </>
        )
    }

    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-300 bg-base-100 border-gray-500 w-full flex justify-between pt-1 pb-1 shadow-lg rounded-full pl-4 pr-4">
            {/* Left side */}
            <nav className="flex items-center">
                <div onClick={() => setNav(!nav)} className="cursor-pointer hover:bg-gray-300 rounded-xl p-2">
                    <AiOutlineMenu size={30} />
                </div>
                <h1 className="flex-1 text-3xl">
                    <Logo href="/dashboard" />
                </h1>
            </nav>

            <div className="flex items-center">
                <ConnectWallet />
            </div>

            {/* Overlay */}
            {nav ? (
                <div className="bg-black/80 fixed w-full h-screen z-20 top-0 left-0"></div>
            ) : (
                <></>
            )}

            {/* Side drawer menu */}
            <div
                className={
                    nav
                        ? "fixed top-0 left-0 w-[300px] h-screen bg-gray-100 z-20 duration-200"
                        : "fixed top-1/4 left-2  w-[45px] h-fit bg-transparent z-20 duration-200"
                }
            >
                {nav ? <>
                    {bigLeftMenu()}
                </> : <>
                    {smallLeftMenu()}
                </>
                }
            </div>
        </div>
    );
};

export default Sidebar;
