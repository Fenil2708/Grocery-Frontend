"use client";
import React, { useEffect, useState } from "react";
import Box from "./Box";
import { TbUser } from "react-icons/tb";
import { GoGift } from "react-icons/go";
import { LiaProductHunt } from "react-icons/lia";
import { MdOutlineCategory } from "react-icons/md";
import { fetchDataFromApi } from "@/admin-utils/api";
import { AiOutlineDollar } from "react-icons/ai";

const DashboardBoxes = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalEarnings: 0,
    lowStockCount: 0
  });

  useEffect(() => {
    fetchDataFromApi("/api/dashboard/stats").then((res) => {
      if (res.success) {
        setStats(res.data);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
      <Box
        title="Total Users"
        count={stats.totalUsers}
        icon={<TbUser size={40} className="text-white ml-auto" />}
        bg="bg-[#10b981]"
        link="/admin/users"
      />
      <Box
        title="Total Orders"
        count={stats.totalOrders}
        icon={<GoGift size={40} className="text-white ml-auto" />}
        bg="bg-[#3872fa]"
        link="/admin/orders"
      />
      <Box
        title="Total Products"
        count={stats.totalProducts}
        icon={<LiaProductHunt size={40} className="text-white ml-auto" />}
        bg="bg-[#4f49e4]"
        link="/admin/products-list"
      />
      <Box
        title="Total Categories"
        count={stats.totalCategories}
        icon={<MdOutlineCategory size={40} className="text-white ml-auto" />}
        bg="bg-[#f22c61]"
        link="/admin/category-list"
      />
      <Box
        title="Total Earnings"
        count={`$${stats.totalEarnings?.toFixed(2)}`}
        icon={<AiOutlineDollar size={40} className="text-white ml-auto" />}
        bg="bg-[#eab308]"
        link="/admin/orders"
      />
      <Box
        title="Low Stock"
        count={stats.lowStockCount}
        icon={<GoGift size={40} className="text-white ml-auto !opacity-40" />}
        bg="bg-[#cb0000]"
        link="/admin/products-list"
      />
    </div>
  );
};

export default DashboardBoxes;
