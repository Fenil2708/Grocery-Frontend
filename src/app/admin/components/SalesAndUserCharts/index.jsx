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
    <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl shadow-slate-200/50 mt-10 border border-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 mb-10">
        <div>
          <h2 className="text-[20px] md:text-[24px] text-slate-800 font-black tracking-tight leading-none">
            Growth Analytics
          </h2>
          <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isActiveChart === 0 ? 'bg-primary' : 'bg-blue-500'}`}></span>
            {isActiveChart === 0 ? 'Monthly Revenue Performance' : 'User Base Expansion'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
          <Button
            className={`!capitalize !font-black !px-6 !py-2.5 !rounded-xl !text-[13px] transition-all ${isActiveChart === 0 ? '!text-white !bg-primary shadow-lg shadow-primary/20' : '!text-slate-400 hover:!bg-white'}`}
            onClick={() => setIsActiveChart(0)}
          >
            Sales
          </Button>

          <Button
            className={`!capitalize !font-black !px-6 !py-2.5 !rounded-xl !text-[13px] transition-all ${isActiveChart === 1 ? '!text-white !bg-blue-500 shadow-lg shadow-blue-500/20' : '!text-slate-400 hover:!bg-white'}`}
            onClick={() => setIsActiveChart(1)}
          >
            Users
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] md:h-[400px] relative z-10 -ml-4 md:ml-0">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={isActiveChart === 0 ? salesData : usersData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02B290" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#02B290" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => isActiveChart === 0 ? `$${value}` : value}
              dx={-10}
            />

            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: '1px solid #f1f5f9', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                padding: '15px 20px',
                fontWeight: '800',
                fontSize: '14px'
              }}
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
            />

            {isActiveChart === 0 ? (
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#02B290"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorSales)"
                animationDuration={2000}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorUsers)"
                animationDuration={2000}
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