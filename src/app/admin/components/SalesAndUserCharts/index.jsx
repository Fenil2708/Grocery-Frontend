"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/admin-utils/api";

const SalesAndUsersCharts = () => {
  const [isActiveChart, setIsActiveChart] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const fetchChartData = async () => {
        try {
            const res = await fetchDataFromApi("/api/dashboard/chart-data");
            if(res.success){
                setSalesData(res.salesData);
                setUsersData(res.usersData);
            }
        } catch (error) {
            console.error(error);
        }
    };
    fetchChartData();
  }, []);

  return (
    <div className="bg-white p-5 rounded-md shadow-md mt-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-[16px] md:text-[18px] text-gray-700 font-[600] text-center md:text-left">
          Total Users & Total Sales
        </h2>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="text"
            className={`!capitalize !font-bold ${isActiveChart === 0 ? '!text-primary !bg-green-50' : '!text-gray-500'}`}
            onClick={() => setIsActiveChart(0)}
            size="small"
          >
            Total Sales
          </Button>

          <Button
            variant="text"
            className={`!capitalize !font-bold ${isActiveChart === 1 ? '!text-blue-500 !bg-blue-50' : '!text-gray-500'}`}
            onClick={() => setIsActiveChart(1)}
            size="small"
          >
            Total Users
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] mt-5">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={isActiveChart === 0 ? salesData : usersData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02B290" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#02B290" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0263b2" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0263b2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#888", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#888", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => isActiveChart === 0 ? `$${value}` : value}
            />

            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            />

            {isActiveChart === 0 ? (
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#02B290"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="users"
                stroke="#0263b2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesAndUsersCharts;