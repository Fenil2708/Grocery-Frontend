"use client";
import { Button, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import Image from "next/image";
import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoIosLogOut, IoMdNotificationsOutline, IoMdMenu } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MyContext } from "@/admin-context/ThemeProvider";
import { fetchDataFromApi } from "@/admin-utils/api";
import { useEffect } from "react";
import { useNotifications } from "@/admin-context/NotificationContext";

const Header = ({ setIsNavOpen, isNavOpen }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notiAnchorEl, setNotiAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openNoti = Boolean(notiAnchorEl);
    const router = useRouter();
    const context = useContext(MyContext);

    const { notifications, markAsRead } = useNotifications();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotiClick = (event) => {
        setNotiAnchorEl(event.currentTarget);
    };

    const handleNotiClose = () => {
        setNotiAnchorEl(null);
    };

    const handleMarkRead = (id) => {
        markAsRead(id);
    };

    const logout = () => {
        handleClose();
        Cookies.remove("adminAccessToken");
        Cookies.remove("adminRefreshToken");
        Cookies.remove("adminUserName");
        Cookies.remove("adminUserEmail");
        Cookies.remove("isLogin");
        context.setIsLogin(false);
        router.push("/admin/login");
    };

    return (
        <header className="w-full h-[60px] bg-white shadow-md flex items-center justify-between px-5 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <Button 
                    className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-600 !bg-gray-100"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                >
                    <IoMdMenu size={22} />
                </Button>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Button 
                        className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-600 !bg-gray-100"
                        onClick={handleNotiClick}
                    >
                        <IoMdNotificationsOutline size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </Button>

                    <Menu
                        anchorEl={notiAnchorEl}
                        open={openNoti}
                        onClose={handleNotiClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        className="mt-2"
                        PaperProps={{
                            style: {
                                width: '320px',
                                maxHeight: '450px'
                            }
                        }}
                    >
                        <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                        </div>
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((noti) => (
                                <MenuItem 
                                    key={noti._id} 
                                    onClick={() => { handleMarkRead(noti._id); handleNotiClose(); }}
                                    className={`!py-3 !border-b !border-gray-50 !flex-col !items-start hover:!bg-blue-50 ${!noti.isRead ? '!bg-blue-50/50' : ''}`}
                                >
                                    <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-tight">{noti.message}</p>
                                    <div className="flex items-center justify-between w-full mt-2">
                                        <span className="text-[10px] text-gray-400">{new Date(noti.createdAt).toLocaleString()}</span>
                                        {!noti.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                    </div>
                                </MenuItem>
                            ))
                        )}
                    </Menu>
                </div>

                <div className="hidden md:flex flex-col text-right">
                    <span className="text-[14px] font-bold text-gray-800 leading-none">{context?.user?.name}</span>
                    <span className="text-[12px] text-gray-500">{context?.user?.email}</span>
                </div>
                <Button
                    className="!w-[45px] !h-[45px] !min-w-[45px] !rounded-full !p-0 !overflow-hidden !border !border-gray-200"
                    onClick={handleClick}
                >
                    {context?.user?.avatar ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${context.user.avatar}`}
                            alt="profile"
                            width={45}
                            height={45}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {context?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </Button>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="mt-2"
            >
                <div className="px-4 py-2 border-b">
                    <p className="text-sm font-bold text-gray-800">{context?.user?.name}</p>
                    <p className="text-[12px] text-gray-500">{context?.user?.email}</p>
                </div>
                <MenuItem onClick={() => { handleClose(); router.push("/admin/my-profile"); }} className="!text-[14px] !font-[500] !text-gray-700 !gap-3">
                    <ListItemIcon className="!min-w-[20px]">
                        <FaRegUser size={18} />
                    </ListItemIcon>
                    My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout} className="!text-[14px] !font-[500] !text-gray-700 !gap-3">
                    <ListItemIcon className="!min-w-[20px]">
                        <IoIosLogOut size={20} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </header>
    );
};

export default Header;
