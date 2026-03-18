"use client";
import AccountSidebar from "@/components/AccountSidebar";
import { Button, Pagination, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState, useCallback } from "react";
import OrderRow from "./tableRow";
import Search from "@/components/Search";
import { MyContext } from "@/context/ThemeProvider";
import { BsBagCheck } from "react-icons/bs";
import { putData } from "@/utils/api";

//... inside Orders component
const Orders = () => {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await context?.fetchDataFromApi("/api/order/my-orders");
      if (res?.success) {
        setOrders(res.data || []);
        setFilteredOrders(res.data || []);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    if (context) {
       fetchMyOrders();
    }
  }, [fetchMyOrders, context]);

  // Check if context exists
  if (!context) {
    return <div>Error: Context not available</div>;
  }

  const handleSearch = (q) => {
    if (!q) {
      setFilteredOrders(orders);
      return;
    }
    const query = q.toLowerCase();
    const filtered = orders.filter(order => 
      order._id?.toLowerCase().includes(query) ||
      order.paymentId?.toLowerCase().includes(query) ||
      order.order_status?.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) return;
      
      const res = await putData(`/api/order/cancel/${orderId}`);
      if (res?.success) {
        context.alertBox("success", "Order cancelled successfully");
        fetchMyOrders(); // Refresh the list
      } else {
        context.alertBox("error", res?.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error(error);
      context.alertBox("error", "Failed to cancel order");
    }
  };

  // Rest of your component remains the same...
  return (
    <section className="bg-gray-50 py-6 md:py-10 min-h-[80vh]">
      <div className="container flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-[260px] shrink-0">
          <AccountSidebar />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl overflow-hidden mb-8">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="info">
                <h1 className="text-[22px] font-black text-gray-800 tracking-tight leading-none">Order History</h1>
                <p className="text-[13px] text-gray-400 mt-2 font-medium tracking-wide items-center flex gap-1.5">
                  <span className="uppercase tracking-widest">Completed orders:</span>
                  <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md min-w-[24px] text-center">{filteredOrders.length}</span>
                </p>
              </div>
              <div className="w-full sm:w-[300px]">
                <Search 
                  placeholder="ID / Status..." 
                  width="100%" 
                  onSearch={handleSearch} 
                  onChange={(val) => !val && setFilteredOrders(orders)} 
                />
              </div>
            </div>

            <div className="overflow-x-auto scroll p-2 md:p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <CircularProgress size={40} className="text-primary" />
                    <p className="text-gray-400 font-bold mt-4 uppercase text-[11px] tracking-widest">Fetching your orders...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left w-[80px] rounded-l-2xl">Details</th>
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left">Order Id</th>
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left">Transaction</th>
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left">Status</th>
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left">Total</th>
                      <th className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] px-6 py-4 text-left rounded-r-2xl">Placed On</th>
                    </tr>
                  </thead>
                  <tbody className="before:block before:h-2">
                    {filteredOrders.map((order, index) => (
                      <OrderRow key={order._id || index} order={order} onCancel={handleCancelOrder} />
                    ))}
                  </tbody>
                </table>
              ) : (
                 <div className="text-center py-24">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
                        <BsBagCheck className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-gray-800 font-black text-[18px]">No Orders Found</h3>
                    <p className="text-gray-400 font-medium max-w-[200px] mx-auto mt-2 italic">Looks like you haven&apos;t placed any orders yet.</p>
                    <Button className="!bg-primary !text-white !font-black !px-10 !py-3.5 !rounded-2xl !mt-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 !capitalize !text-[14px]" onClick={() => window.location.href="/"}>Start Shopping</Button>
                 </div>
              )}
            </div>
            
            {filteredOrders.length > 10 && (
                <div className="flex items-center justify-center py-10 border-t border-gray-50 bg-gray-50/30">
                    <Pagination 
                        count={Math.ceil(filteredOrders.length / 10)} 
                        showFirstButton 
                        showLastButton 
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: '12px',
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;