"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import Image from "next/image";

const OrderRow = ({ order, onCancel }) => {
  const [expendIndex, setExpendIndex] = useState(false);

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toISOString().split("T")[0]
    : "—";

  return (
    <>
      <tr className="hover:bg-gray-50/80 transition-all group">
        <td className="px-6 py-4">
          <Button
            className={`!min-w-[40px] !h-[40px] !w-[40px] !rounded-xl !text-gray-400 !bg-gray-100/50 hover:!bg-primary/10 hover:!text-primary transition-all ${expendIndex ? '!bg-primary !text-white shadow-lg shadow-primary/20' : ''}`}
            onClick={() => setExpendIndex(!expendIndex)}
          >
            <FaAngleDown size={18} className={`transition-all duration-300 ${expendIndex ? 'rotate-180' : ''}`} />
          </Button>
        </td>
        <td className="px-6 py-4 font-black text-gray-800 text-[14px] uppercase tracking-wider">
           #{order?._id?.toString().slice(-6)}
        </td>
        <td className="px-6 py-4">
          <span className="text-[13px] text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            {order?.paymentId || "Cash on Delivery"}
          </span>
        </td>
        <td className="px-6 py-4">
           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
            order?.order_status === 'confirm' ? 'bg-blue-50 text-blue-600 border-blue-100' :
            order?.order_status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
            order?.order_status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
            'bg-orange-50 text-orange-600 border-orange-100'
          }`}>
            {order?.order_status}
          </span>
        </td>
        <td className="px-6 py-4 font-black text-primary text-[16px]">
           ${order?.totalAmt?.toFixed(2)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[12px]">
            <MdDateRange size={18} className="text-gray-300" />
            {formattedDate}
          </div>
        </td>
      </tr>

      {expendIndex && (
        <tr>
          <td colSpan={6} className="px-6 pb-6 pt-2">
             <div className="bg-gray-50/50 rounded-3xl border border-gray-100 p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group/card">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover/card:bg-primary transition-colors"></div>
                        <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Shipping Destination</h4>
                        <div className="space-y-2">
                             <p className="font-black text-gray-800 text-[15px]">{order?.delivery_address?.addressType || "Address"}</p>
                             <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{order?.delivery_address?.address_line1}</p>
                             <p className="text-[13px] text-gray-400 font-bold">{order?.delivery_address?.city}, {order?.delivery_address?.state} - {order?.delivery_address?.pincode}</p>
                             <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
                                <span className="text-[11px] text-gray-300 font-black uppercase">Phone</span>
                                <span className="text-gray-700 font-black text-[13px]">+{order?.delivery_address?.mobile}</span>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group/card flex flex-col justify-center items-center">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover/card:bg-blue-500 transition-colors"></div>
                        <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 w-full text-left">Actions</h4>
                        
                        {order?.order_status !== 'delivered' && order?.order_status !== 'cancelled' ? (
                          <div className="w-full h-full flex items-center justify-center">
                              <Button 
                                className="!bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white !font-bold !rounded-xl !px-6 !py-2.5 transition-all !w-full shadow-sm shadow-red-100"
                                onClick={() => onCancel && onCancel(order._id)}
                              >
                                Cancel Order
                              </Button>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 font-medium text-[13px] italic">
                                Action not available
                              </span>
                          </div>
                        )}
                    </div>
                </div>

                <div className="products">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Ordered Items ({order?.products?.length})</h4>
                        <div className="h-px flex-1 bg-gray-100 mx-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order?.products?.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/20 transition-all duration-300 group/item">
                                <div className="img rounded-xl overflow-hidden w-[70px] h-[70px] shrink-0 border border-gray-50 bg-gray-50 p-2 flex items-center justify-center">
                                    <Image
                                      src={product?.image || "/product1.png"}
                                      alt={product?.productTitle}
                                      width={60}
                                      height={60}
                                      className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500"
                                      unoptimized
                                    />
                                </div>
                                <div className="info flex-1 min-w-0">
                                    <h2 className="text-gray-800 text-[14px] font-black line-clamp-1 group-hover/item:text-primary transition-colors">
                                      {product?.productTitle}
                                    </h2>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-gray-400 text-[11px] font-black tracking-widest uppercase">Qty: {product?.quantity}</span>
                                        <span className="text-primary font-black text-[15px]">
                                            ${product?.subTotal?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderRow;
