import Navlink from "@/types/navlink.interface";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { HiFolder } from "react-icons/hi2";


const createLink = (name:string, imgUrl:string, link:string, disabled:boolean = false) => {
    var nl: Navlink = {
        name,
        imgUrl,
        link,
        disabled
    }
    return nl
}

const navlinks:Navlink[] = [
    createLink("dashboard", MdSpaceDashboard, "/dashboard"),
    createLink("payment", MdPayment, "/", true),
    createLink("create campaign", FaProjectDiagram, "/create-campaign"),
    createLink("my-campaign", HiFolder, "/my-campaign"),
    createLink("home", FaHome, "/")
]

export default navlinks
