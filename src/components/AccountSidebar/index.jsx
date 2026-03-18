"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { BsBagCheck } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeProvider";
import Cookies from "js-cookie";

const AccountSidebar = () => {
    const context = React.useContext(MyContext);
    const router = useRouter();
    const pathname = usePathname();

    const NavLinks = [
        {
            name: "My Profile",
            href: "/my-account",
            icon: <FaRegUser size={20} />,
        },
        {
            name: "Address",
            href: "/address",
            icon: <FiMapPin size={20} />,
        },
        {
            name: "My List",
            href: "/my-list",
            icon: <FaRegHeart size={20} />,
        },
        {
            name: "My Orders",
            href: "/my-orders",
            icon: <BsBagCheck size={20} />,
        },
    ];

    const logout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("userName");
        Cookies.remove("userEmail");
        context.setIsLogin(false);
        context.alertBox("success", "Logged out successfully!");
        router.push("/login");
    };

    return (
        <aside className="w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl overflow-hidden shrink-0">
            <div className="pt-10 pb-6 px-6 text-center border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="relative inline-block group">
                    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[2.5rem] overflow-hidden m-auto relative group border-4 border-white shadow-xl transition-all duration-500 group-hover:rounded-2xl">
                        {context.user?.avatar ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${context.user.avatar}`}
                                alt="avatar"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-2xl md:text-3xl font-black">
                                {context.user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Link href="/my-account" className="w-full h-full flex items-center justify-center"></Link>
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="mt-5">
                    <h4 className="text-[16px] md:text-[18px] font-black text-gray-800 line-clamp-1 tracking-tight">
                        {context.user?.name}
                    </h4>
                    <p className="text-[12px] text-gray-400 font-medium truncate mt-0.5">{context.user?.email}</p>
                </div>
            </div>

            <nav className="p-4 flex flex-col gap-1.5">
                {NavLinks?.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} className="w-full" key={index}>
                            <Button className={`!w-full !justify-start !px-5 !py-3.5 gap-4 !rounded-2xl transition-all group ${
                                isActive 
                                ? '!bg-primary !text-white shadow-lg shadow-primary/20' 
                                : '!text-gray-500 hover:!bg-gray-50 hover:!text-gray-900'
                            }`}>
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-primary'}`}>
                                    {item.icon}
                                </span>
                                <span className={`!capitalize !text-[13px] !font-black !tracking-wide ${isActive ? '' : ''}`}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                            </Button>
                        </Link>
                    );
                })}

                <div className="my-3 border-t border-gray-50 mx-4"></div>

                <Button 
                    className="!text-red-500 !capitalize !w-full !justify-start !px-5 !py-3.5 gap-4 !text-[13px] !font-black !rounded-2xl hover:!bg-red-50 transition-all group" 
                    onClick={logout}
                >
                    <IoMdLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </Button>
            </nav>
        </aside>
    );
};

export default AccountSidebar;
