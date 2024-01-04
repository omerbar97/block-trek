'use client';
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
import dashboardMenu from "@/constants/dashboardMenu";
import AppLogo from "../assets/logo"
import Link from "next/link";
import CustomBtn from "./shared/customBtn.component";


const Sidebar = () => {
    const [nav, setNav] = useState(false);
    const pathname = usePathname();

    const logo = (outline: string, bold: string) => {
        return (
            <div className="flex">
                <Link href='/dashboard' className="flex">
                    <AppLogo size={42} className='ml-5 mr-5' />{outline} <span className="font-bold">{bold}</span>
                </Link>
            </div>
        );
    };

    return (
        <div className="w-full mx-auto flex justify-between p-4 shadow-sm">
            {/* Left side */}
            <div className="flex items-center">
                <div onClick={() => setNav(!nav)} className="cursor-pointer">
                    <AiOutlineMenu size={30} />
                </div>
                <h1 className="text-3xl lg:text-4xl">
                    {logo("Block", "Trek")}
                </h1>
                <CustomBtn className="ml-5" content="Connect Wallet" onclick={() => {console.log("connecting wallet")}}/>
            </div>

            {/* Overlay */}
            {nav ? (
                <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
            ) : (
                ""
            )}

            {/* Side drawer menu */}
            <div
                className={
                    nav
                        ? "fixed top-0 left-0 w-[300px] h-screen bg-gray-100 z-10 duration-200"
                        : "fixed top-1/4 left-2  w-[45px] h-fit bg-transparent z-10 duration-200"
                }
            >
                {nav ? <>
                    <AiOutlineClose
                        onClick={() => setNav(!nav)}
                        size={30}
                        className="absolute right-4 top-4 cursor-pointer"
                    />
                    <h2 className="text-2xl p-4">
                        {logo("Block", "Trek")}
                    </h2>
                    <nav>
                        <ul className="flex flex-col p-4 text-gray-800 border border-gray-300 bg-gray-100">

                            {dashboardMenu.map(({ title, icon, link }, index) => {
                                return (
                                    <div key={index} className=" py-4">
                                        <Link href={link}>
                                            <li className={`text-xl flex cursor-pointer  w-[100%] rounded-full mx-auto p-2 ${pathname === link
                                                ? 'text-white bg-black'
                                                : 'hover:text-white hover:bg-black'
                                                }`}>
                                                {icon} <span className="ml-3">{title}</span>
                                            </li>
                                        </Link>
                                    </div>
                                );
                            })}
                        </ul>
                    </nav>
                </> : <>
                    <ul className="hidden sm:flex flex-col text-gray-800 border border-gray-300 bg-gray-100 rounded-md">
                        {dashboardMenu.map(({ icon, link }, index) => {
                            return (
                                <div key={index} className="py-4">
                                    <Link href={link}>
                                        <li
                                            className={`cursor-pointer w-[80%] rounded-lg mx-auto pl-1 ${pathname === link
                                                ? 'text-white bg-black'
                                                : 'hover:text-white hover:bg-black'
                                                }`}
                                        >
                                            {icon}
                                        </li>
                                    </Link>
                                </div>
                            );
                        })}
                    </ul>
                </>
                }
            </div>
        </div>
    );
};

export default Sidebar;
