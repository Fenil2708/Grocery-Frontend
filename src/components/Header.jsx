"use client";
import Image from "next/image";
import Link from "next/link";
import React, { use, useContext, useRef, useState } from "react";
import Search from "./Search";
import { FaAngleDown, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Nav from "./Nav";
import { MyContext } from "@/context/ThemeProvider";
import { Button, MenuItem } from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import { FaRegUser } from "react-icons/fa6";
import { IoMdNotificationsOutline, IoMdLogOut, IoMdMenu } from "react-icons/io";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { MdOutlineLocationOn, MdClose } from "react-icons/md";
import { Drawer, IconButton, List, ListItem, ListItemText, ListItemIcon as MuiListItemIcon, Divider } from "@mui/material";
import { fetchDataFromApi } from "@/utils/api"; // Add this import
import Cookies from 'js-cookie';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const openNoti = Boolean(notiAnchorEl);

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
    // Mark all as read when opening? Or individually?
    // Let's mark visible ones as read for simplicity or just keep it active.
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const context = useContext(MyContext);
  const router = useRouter();

  const logout = () => {
    fetchDataFromApi(`/api/user/logout?token=${Cookies.get('accessToken')}`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        context.setUser(null);
        context.setCartData([]);
        context.setMyListData([]);
        setAnchorEl(null);
        router.push("/");
      }
    })
  }

  const handleMarkRead = (id) => {
    markAsRead(id);
  };

  return (
    <>
      <div className="headerWrapper sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50/80 transition-all duration-300">
        <header className="py-4">
          <div className="container flex items-center justify-between gap-6 lg:gap-10">
            <div className="flex items-center gap-4">
              <IconButton 
                className="lg:!hidden !bg-gray-50 !p-2.5 !rounded-2xl transition-all active:scale-95" 
                onClick={toggleMobileMenu}
              >
                <IoMdMenu size={26} className="text-gray-800" />
              </IconButton>
              <div className="logo shrink-0 transition-transform duration-500 hover:scale-[1.02]">
                <Link href={"/"}>
                  <Image src="/logo.png" width={180} height={48} alt="Logo" className="w-[130px] md:w-[200px] h-auto" />
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-1 justify-center max-w-[700px]">
              <div className="w-full relative group shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl">
                <Search placeholder="Search for fresh items..." width="100%" />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5 lg:gap-6">
              {
                context?.isLogin === false ?
                  <div className="hidden md:flex items-center gap-5">
                    <Link href={"/login"} className="text-[15px] font-black text-gray-500 hover:text-primary transition-all tracking-tight h-[48px] flex items-center">
                      Sign In
                    </Link>
                    <Link href={"/register"}>
                        <Button className="!bg-primary !text-white !font-black !px-8 !h-[48px] !rounded-2xl shadow-xl shadow-primary/20 hover:!bg-secondary transition-all active:scale-95 !capitalize !text-[14px]">
                            Join Now
                        </Button>
                    </Link>
                  </div>
                  :
                  <div className="flex items-center gap-2 relative">
                    <Button 
                      className={`!capitalize !text-gray-800 !text-left !justify-start !gap-3 !bg-gray-50/50 !border-2 !rounded-2xl !py-1 !pl-1 !pr-5 !min-w-0 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.01)] active:scale-95 ${open ? '!bg-white !border-primary/20 !shadow-lg' : '!border-transparent hover:!bg-white hover:!border-gray-100'}`} 
                      onClick={handleClick}
                    >
                      <div className="w-[42px] h-[42px] rounded-[14px] overflow-hidden flex items-center justify-center bg-white border-2 border-white shadow-sm ring-1 ring-gray-100">
                        {context?.user?.avatar ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${context.user.avatar}`}
                            alt="avatar"
                            width={42}
                            height={42}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-[16px]">
                            {context?.user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="info hidden lg:flex flex-col leading-none gap-1">
                        <span className="text-[14px] font-black text-gray-800 truncate max-w-[120px] tracking-tight">{context?.user?.name}</span>
                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.05em]">Member</span>
                      </div>
                      <FaAngleDown size={14} className={`text-gray-300 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`} />
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            width: 260,
                            borderRadius: '24px',
                            mt: 2,
                            p: 1,
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                            '& .MuiMenuItem-root': {
                                borderRadius: '16px',
                                px: 2,
                                py: 1.5,
                                fontSize: '14px',
                                fontWeight: '800',
                                color: '#4b5563',
                                '&:hover': { backgroundColor: 'rgba(2, 178, 144, 0.05)', color: '#02B290' },
                                mb: 0.5
                            }
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => router.push("/my-account")} className="group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FaRegUser size={16} />
                          </div>
                          My Profile
                        </div>
                      </MenuItem>

                      <MenuItem onClick={() => router.push("/my-list")} className="group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FaRegHeart size={16} />
                          </div>
                          My Wishlist
                        </div>
                      </MenuItem>

                      <MenuItem onClick={() => router.push("/my-orders")} className="group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <HiOutlineShoppingBag size={18} />
                          </div>
                          My Orders
                        </div>
                      </MenuItem>

                      <MenuItem onClick={() => router.push("/address")} className="group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MdOutlineLocationOn size={20} />
                          </div>
                          Addresses
                        </div>
                      </MenuItem>

                      <Divider className="!my-2 !opacity-50" />

                      <MenuItem onClick={logout} className="!text-red-500 hover:!bg-red-50 hover:!text-red-600">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center text-red-500">
                            <IoMdLogOut size={18} />
                          </div>
                          Logout
                        </div>
                      </MenuItem>
                    </Menu>
                  </div>
              }

              <div className="flex items-center gap-2 md:gap-4">
                {context?.isLogin && (
                  <div className="relative">
                    <Button 
                        className="!min-w-0 !w-[48px] !h-[48px] !rounded-2xl !bg-gray-50/50 !text-gray-800 hover:!bg-white hover:!text-primary hover:!border-gray-100 border-2 border-transparent transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.01)]" 
                        onClick={handleNotiClick}
                    >
                      <IoMdNotificationsOutline size={26} />
                      {unreadCount > 0 && (
                        <span className="bg-red-500 ring-4 ring-white w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center absolute -top-1 -right-1 z-50 animate-bounce">
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
                      slotProps={{
                        paper: {
                          sx: { width: 340, maxHeight: 450, mt: 2, borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', border: '1px solid #f3f4f6' }
                        }
                      }}
                    >
                      <div className="px-6 py-4 border-b border-gray-50 font-black text-gray-800 flex items-center justify-between">
                          <span>Notifications</span>
                          {unreadCount > 0 && <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-lg uppercase tracking-widest font-black leading-none">{unreadCount} New</span>}
                      </div>
                      <div className="custom-scrollbar overflow-y-auto max-h-[350px]">
                        {notifications.length === 0 ? (
                            <div className="px-6 py-12 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-300">
                                    <IoMdNotificationsOutline size={32} />
                                </div>
                                <p className="text-gray-400 text-[14px] font-bold">No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((noti) => (
                            <MenuItem
                                key={noti._id}
                                onClick={() => { handleMarkRead(noti._id); handleNotiClose(); }}
                                className={`!py-4 !px-6 !border-b !border-gray-50 !whitespace-normal !flex-col !items-start hover:!bg-gray-50 transition-colors ${!noti.isRead ? '!bg-primary/5' : ''}`}
                            >
                                <div className="text-[14px] text-gray-800 font-bold leading-snug">{noti.message}</div>
                                <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-2">{new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(noti.createdAt).toLocaleDateString()}</div>
                            </MenuItem>
                            ))
                        )}
                      </div>
                    </Menu>
                  </div>
                )}

                <Link href={"/my-list"} className="relative group active:scale-95 transition-all">
                  <div className="w-[48px] h-[48px] rounded-2xl bg-gray-50/50 border-2 border-transparent group-hover:bg-white group-hover:border-gray-100 flex items-center justify-center text-gray-800 group-hover:text-primary transition-all shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <FaRegHeart size={22} />
                  </div>
                  <span className="bg-red-500 ring-4 ring-white w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center absolute -top-1 -right-1 z-50">
                    {context?.myListData?.length || 0}
                  </span>
                </Link>

                <Link href={"/cart"} className="relative group active:scale-95 transition-all">
                  <div className="w-[48px] h-[48px] rounded-2xl bg-primary/5 border-2 border-transparent group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <HiOutlineShoppingBag size={25} />
                  </div>
                  <span className="bg-primary ring-4 ring-white w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center absolute -top-1 -right-1 z-50">
                    {context?.cartData?.length || 0}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:hidden container mt-5">
            <div className="relative shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
                <Search placeholder="Search items..." width="100%" />
            </div>
          </div>
        </header>

        <div className="hidden lg:block">
          <Nav />
        </div>

        <Drawer 
          open={isMobileMenuOpen} 
          onClose={toggleMobileMenu}
          PaperProps={{
            sx: { 
                width: '85%', 
                maxWidth: '360px', 
                borderRadius: '0 32px 32px 0',
                boxShadow: '20px 0 60px rgba(0,0,0,0.1)'
            }
          }}
        >
          <div className="w-full h-full flex flex-col bg-white">
            <div className="px-8 pt-10 pb-8 flex items-center justify-between">
              <Link href="/" onClick={toggleMobileMenu} className="transform hover:scale-105 transition-transform">
                <Image src="/logo.png" width={160} height={40} alt="Logo" className="h-auto" />
              </Link>
              <IconButton onClick={toggleMobileMenu} className="!bg-gray-50 !shadow-sm !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
                <MdClose size={22} />
              </IconButton>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
              <Nav isMobile={true} closeMobileMenu={toggleMobileMenu} />
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              {context?.isLogin === false ? (
                <div className="flex flex-col gap-4">
                  <Button 
                    fullWidth 
                    variant="contained" 
                    className="!bg-primary !text-white !font-black !py-4 !rounded-[20px] !shadow-xl !shadow-primary/20 !capitalize !text-[15px] active:scale-95 transition-all" 
                    onClick={() => { router.push("/login"); toggleMobileMenu(); }}
                  >
                    Log In
                  </Button>
                  <Button 
                    fullWidth 
                    className="!text-gray-800 !bg-white !border-2 !border-gray-100 !font-black !py-4 !rounded-[20px] !capitalize !text-[15px] hover:!border-primary/20 hover:!bg-gray-50 active:scale-95 transition-all shadow-sm" 
                    onClick={() => { router.push("/register"); toggleMobileMenu(); }}
                  >
                    Join Now
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={() => { router.push("/my-account"); toggleMobileMenu(); }}>
                  <div className="w-[56px] h-[56px] rounded-[18px] overflow-hidden flex items-center justify-center bg-gray-50 shadow-inner p-0.5">
                    {context?.user?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${context.user.avatar}`}
                        alt="avatar"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-[16px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl rounded-[16px]">
                        {context?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col leading-tight min-w-0 flex-1">
                    <span className="font-black text-[15px] text-gray-800 truncate tracking-tight">{context?.user?.name}</span>
                    <span className="text-[12px] text-gray-400 font-bold truncate mt-1 tracking-tight">{context?.user?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Header;
