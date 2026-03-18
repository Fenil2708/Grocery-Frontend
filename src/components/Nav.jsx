"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { FaAngleDown } from "react-icons/fa";

const Nav = ({ isMobile, closeMobileMenu }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res.success) {
        setCategories(res.data);
      }
    });
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col py-6 px-6">
        <div className="flex flex-col gap-2">
          <Link
            href={"/"}
            onClick={closeMobileMenu}
            className="flex items-center justify-between text-[16px] text-gray-800 font-black py-4 px-5 rounded-[20px] bg-gray-50/50 hover:bg-primary/5 hover:text-primary transition-all group"
          >
            <span>Home</span>
            <FaAngleDown size={14} className="-rotate-90 opacity-40 group-hover:opacity-100 transition-all" />
          </Link>
          
          <div className="h-[1px] bg-gray-100 my-4 mx-4"></div>
          
          <div className="flex items-center justify-between px-5 mb-2">
            <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Categories</h4>
            <span className="w-1.5 h-1.5 bg-primary/20 rounded-full"></span>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5">
            {categories?.length > 0 &&
                categories.map((cat, index) => (
                <Link
                    key={index}
                    href={`/products?category=${cat._id}`}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between text-[15px] text-gray-600 font-bold py-4 px-5 rounded-[20px] hover:bg-primary/5 hover:text-primary transition-all group capitalize"
                >
                    <span>{cat.name}</span>
                    <FaAngleDown size={14} className="-rotate-90 opacity-20 group-hover:opacity-100 transition-all hover:translate-x-1" />
                </Link>
                ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white/50 backdrop-blur-md border-b border-gray-50/80 sticky top-[80px] z-40 hidden lg:block transition-all duration-300">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href={"/"}
            className="text-[14px] text-gray-400 font-black hover:text-primary transition-all relative group py-5 tracking-tight flex items-center gap-2"
          >
            Home
            <span className="absolute bottom-[-1px] left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <div className="flex items-center gap-10 h-full">
            {categories?.length > 0 &&
              categories.slice(0, 6).map((cat, index) => {
                return (
                  <Link
                    key={index}
                    href={`/products?category=${cat._id}`}
                    className="text-[14px] text-gray-400 font-black hover:text-primary transition-all relative group py-5 capitalize tracking-tight"
                  >
                    {cat.name}
                    <span className="absolute bottom-[-1px] left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              })}
          </div>

          {categories?.length > 6 && (
            <div className="relative group/more h-full">
              <span className="text-[14px] text-gray-400 font-black group-hover/more:text-primary flex items-center gap-2 cursor-pointer py-5 transition-all tracking-tight">
                More Categories <FaAngleDown size={14} className="group-hover/more:rotate-180 transition-transform duration-300" />
              </span>

              <div className="absolute top-[100%] left-0 bg-white/95 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[28px] border border-gray-50 p-3 min-w-[260px] invisible opacity-0 translate-y-4 group-hover/more:visible group-hover/more:opacity-100 group-hover/more:translate-y-0 transition-all duration-500 z-50">
                <div className="grid grid-cols-1 gap-1 px-1">
                  {categories.slice(6).map((cat, index) => {
                    return (
                      <Link
                        key={index}
                        href={`/products?category=${cat._id}`}
                        className="text-[14px] text-gray-500 font-bold hover:text-primary hover:bg-primary/5 flex items-center justify-between py-3 px-4 rounded-2xl transition-all capitalize group/item"
                      >
                        {cat.name}
                        <FaAngleDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-auto hidden xl:flex items-center gap-8">
            <div className="flex items-center gap-3 py-1 px-4 bg-primary/5 rounded-full border border-primary/10">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[12px] font-black text-primary/80 uppercase tracking-widest">Free Delivery</span>
                <span className="text-[12px] font-bold text-gray-400 border-l border-primary/20 pl-3">Orders over <span className="text-primary">$50</span></span>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

