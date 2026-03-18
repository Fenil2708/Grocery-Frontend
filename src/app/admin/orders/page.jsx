"use client";
import { Pagination } from "@mui/material";
import React, { useState, useEffect } from "react";
import OrderRow from "./tableRow";
import Search from "@/app/admin/components/Search";
import { fetchDataFromApi } from "@/admin-utils/api";
import { CircularProgress } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const LIMIT = 10;

  const fetchOrders = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        search: searchQuery,
      });

      const data = await fetchDataFromApi(`/api/order?${params.toString()}`);

      if (data?.success) {
        setOrders(data.data || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, search);
  }, [currentPage, search]);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders(1, search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, order_status: newStatus } : o
      )
    );
  };

  return (
    <div className="wrapper w-full p-4">
      <div className="bg-white shadow-md rounded-md mb-5 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="info text-center sm:text-left">
            <h1 className="text-[18px] md:text-[20px] font-[600] text-gray-600 leading-tight">Orders</h1>
            <p className="text-gray-500 text-[14px]">
              Showing <span className="text-primary font-bold">{totalOrders}</span> orders
            </p>
          </div>
          <div className="w-full sm:max-w-[300px]">
            <Search
              placeholder="Search Order..."
              width="100%"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-5 scroll">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left"></th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Order Id
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Customer
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Payment Info
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Phone Number
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Address
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Pincode
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Total Amount
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  User Id
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Order Status
                </th>
                <th className="text-[14px] text-gray-700 font-[600] px-4 py-3 whitespace-nowrap text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-16">
                    <CircularProgress />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-16 text-gray-400 text-[15px]"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center py-10">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
