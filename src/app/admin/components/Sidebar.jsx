"use client";
import React, { useState } from "react";
import Image from "next/image";
import { RxDashboard } from "react-icons/rx";
import { LiaImageSolid } from "react-icons/lia";
import { MdCategory } from "react-icons/md";
import { TbBrandProducthunt } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { PiImagesSquare } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { Button } from "@mui/material";
import { LiaAngleDownSolid } from "react-icons/lia";
import Link from "next/link";
import { Collapse } from "react-collapse";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MyContext } from "@/admin-context/ThemeProvider";

const Sidebar = ({ isNavOpen, setIsNavOpen }) => {
    const context = React.useContext(MyContext);
    const [isOpenTab, setIsOpenTab] = useState(null);
    const router = useRouter();

    const logout = () => {
        Cookies.remove("adminAccessToken");
        Cookies.remove("adminRefreshToken");
        Cookies.remove("adminUserName");
        Cookies.remove("adminUserEmail");
        Cookies.remove("isLogin");
        router.push("/admin/login");
    };

  const sidebarTabs = [
    {
      name: "Dashboard",
      icon: <RxDashboard size={20} className="group-hover:text-primary" />,
      href: "/admin",
    },
    {
      name: "Home Slides",
      icon: <LiaImageSolid size={20} className="group-hover:text-primary" />,
      href: null,
      children: [
        {
          name: "Home Slides List",
          href: "/admin/home-slides",
        },
        {
          name: "Add Home Slides",
          href: "/admin/home-slides/add-home-slide",
        },
      ],
    },
    {
      name: "Category",
      icon: <MdCategory size={22} className="group-hover:text-primary" />,
      href: null,
      children: [
        {
          name: "Category List",
          href: "/admin/category-list",
        },
        {
          name: "Add New Category",
          href: "/admin/category-list/add-category",
        },
      ],
    },
    {
      name: "Products",
      icon: <TbBrandProducthunt size={22} className="group-hover:text-primary" />,
      href: null,
      children: [
        {
          name: "Product List",
          href: "/admin/products-list",
        },
        {
          name: "Add New Product",
          href: "/admin/products-list/add-product",
        },
      ],
    },
    {
      name: "Users",
      icon: <TbUsers size={22}  className="group-hover:text-primary" />,
      href: "/admin/users",
    },
    {
      name: "Orders",
      icon: <IoBagCheckOutline size={20} className="group-hover:text-primary" />,
      href: "/admin/orders",
    },
    {
      name: "Banners",
      icon: <PiImagesSquare size={20} className="group-hover:text-primary" />,
      href: null,
      children: [
        {
          name: "Banners List",
          href: "/admin/banners",
        },
        {
          name: "Add New Banner",
          href: "/admin/banners/add-banner",
        },
      ],
    },
    {
      name: "My Profile",
      icon: <FaRegUser size={18} className="group-hover:text-primary" />,
      href: "/admin/my-profile",
    },
    {
      name: "Logout",
      icon: <IoIosLogOut size={20} className="group-hover:text-primary" />,
      href: null,
    },
  ];

  return (
    <aside className="w-full px-2 sticky top-0 z-50">
      <div className={`p-4 flex flex-col items-center border-b mb-2 transition-all duration-300 ${!isNavOpen && 'opacity-0 invisible h-0 overflow-hidden'}`}>
        <Link href={"/admin"} className="mb-6"><Image src="/logo.png" alt="logo" width={180} height={40} className="w-[180px]" /></Link>
        
        <div className="flex flex-col items-center text-center">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-3 border-2 border-primary shadow-sm">
                {context?.user?.avatar ? (
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${context.user.avatar}`} 
                        alt="avatar" 
                        width={80}
                        height={80}
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                        {context?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <h4 className="text-[16px] font-bold text-gray-800 leading-tight">{context?.user?.name}</h4>
            <p className="text-[12px] text-gray-500 truncate w-full px-2">{context?.user?.email}</p>
        </div>
      </div>

      <div className="scrolling">
        {sidebarTabs &&
          sidebarTabs?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item?.href !== null ? (
                  <Link href={item?.href}>
                    <Button className={`!w-full !text-left !justify-start !capitalize !text-gray-800 !text-[15px] !hover:bg-gray-200 !px-4 !py-[8px] gap-3 group ${!isNavOpen && '!justify-center !px-0'}`}>
                      {item?.icon}
                      {isNavOpen && (
                        <>
                          {item?.name}
                          {item?.children && (
                            <LiaAngleDownSolid size={15} className="ml-auto" />
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className={`!w-full !text-left !justify-start !capitalize !text-gray-800 !text-[16px] !hover:bg-gray-200 !px-4 !py-[8px] gap-3 group ${!isNavOpen && '!justify-center !px-0'}`}
                    onClick={() => {
                        if (item.name === "Logout") {
                            logout();
                        } else {
                            if (!isNavOpen && setIsNavOpen) {
                                setIsNavOpen(true);
                            }
                            setIsOpenTab(isOpenTab === index ? null : index);
                        }
                    }}
                  >
                    {item?.icon}
                    {isNavOpen && (
                      <>
                        {item?.name}
                        {item?.children && (
                          <LiaAngleDownSolid size={15} className={`ml-auto transition-all ${isOpenTab === index && 'rotate-180'}`} />
                        )}
                      </>
                    )}
                  </Button>
                )}

                {item?.children && (
                  <Collapse isOpened={isOpenTab === index ? true : false}>
                    <div className="dropdown w-full flex flex-col gap-3 pl-12 py-1">
                      {item?.children?.map((tab, index_) => {
                        return (
                          <Link
                            href={tab?.href}
                            key={index_}
                            className="text-[14px] flex items-center gap-3 text-gray-600 hover:text-primary"
                          >
                            {tab?.name}
                          </Link>
                        );
                      })}
                    </div>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </aside>
  );
};

export default Sidebar;
