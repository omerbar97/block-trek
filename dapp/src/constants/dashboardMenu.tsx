import DashboardMenu from "@/types/dashboard.interface";
import { ReactNode } from "react";
import { GiUnstableProjectile } from "react-icons/gi";
import { FaFolderOpen } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { IoCreate } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";


const createDashboardMenu = (title: string, icon: ReactNode, link: string) => {
    return {
        title,
        icon,
        link,
    };
};

const dashboardMenu: DashboardMenu[] = [
    createDashboardMenu("Fund Campaigns", <GiUnstableProjectile size={25} className='mr-4' />, "dashboard/campaigns"),
    createDashboardMenu("Create Campaign", <IoCreate size={25} className='mr-4' />, "dashboard/create-campaign"),
    createDashboardMenu("My Campaigns", <FaFolderOpen size={25} className='mr-4' />, "dashboard/my-campaigns"),
    createDashboardMenu("My Donation", <IoWallet size={25} className='mr-4' />, "dashboard/my-donation"),
    createDashboardMenu("Logout", <RiLogoutBoxFill size={25} className='mr-4' />, "/"),

];

export default dashboardMenu;
