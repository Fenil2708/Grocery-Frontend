"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { FaAngleDown } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { putData } from "@/admin-utils/api";

const OrderRow = ({ order, onStatusChange }) => {
  const [expendIndex, setExpendIndex] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order?.order_status || "confirm");
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setOrderStatus(newStatus);
    setUpdating(true);

    try {
      const result = await putData(`/api/order/${order._id}/status`, {
        order_status: newStatus,
      });

      if (result?.success) {
        if (onStatusChange) onStatusChange(order._id, newStatus);
      } else {
        // Revert on failure
        setOrderStatus(order?.order_status || "confirm");
        alert("Failed to update order status. Please try again.");
      }
    } catch (err) {
      setOrderStatus(order?.order_status || "confirm");
      alert("Error updating status.");
    } finally {
      setUpdating(false);
    }
  };

  const address = order?.delivery_address;
  const user = order?.userId;

  const fullAddress = [
    address?.address_line1,
    address?.city,
    address?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toISOString().split("T")[0]
    : "—";

  const statusColorMap = {
    confirm: "text-primary",
    ordered: "text-yellow-600",
    delivered: "text-green-600",
    cancelled: "text-red-500",
    pending: "text-gray-500",
  };

  return (
    <>
      <tr className="border-b-[1px] border-[rgba(0,0,0,0.05)] hover:bg-slate-50/50 transition-colors group">
        {/* Expand toggle */}
        <td className="px-4 py-4">
          <Button
            className="!min-w-[40px] !h-[40px] !w-[40px] !rounded-2xl !text-slate-400 !bg-slate-50 hover:!bg-primary hover:!text-white transition-all shadow-sm"
            onClick={() => setExpendIndex(!expendIndex)}
          >
            <FaAngleDown
              size={18}
              className={`transition-transform duration-300 ${expendIndex ? "rotate-180" : ""}`}
            />
          </Button>
        </td>

        {/* Order ID */}
        <td data-label="ORDER ID" className="text-[13px] text-slate-900 px-4 py-4 font-black whitespace-nowrap tabular-nums">
          <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px]">#{order?._id?.toString().slice(-6).toUpperCase()}</span>
        </td>

        {/* Customer */}
        <td data-label="CUSTOMER" className="px-4 py-4">
          <div className="flex items-center gap-3 w-full max-w-[260px]">
            <div className="rounded-xl w-[45px] h-[45px] overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user?.name}
                  width={45}
                  height={45}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-[18px] font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="info flex flex-col min-w-0">
              <span className="text-slate-900 text-[14px] font-black leading-tight truncate">
                {user?.name || "—"}
              </span>
              <span className="text-slate-400 text-[12px] font-bold truncate">
                {user?.email || "—"}
              </span>
            </div>
          </div>
        </td>

        {/* Payment ID & Status */}
        <td data-label="PAYMENT" className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-col items-end md:items-start">
            <span className="font-black text-[13px] text-slate-600 tabular-nums">{order?.paymentId || "—"}</span>
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md mt-1 ${order?.payment_status?.toLowerCase() === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {order?.payment_status || "Pending"}
            </span>
          </div>
        </td>

        {/* Phone Number */}
        <td data-label="PHONE" className="text-[13px] text-slate-600 font-black px-4 py-4 whitespace-nowrap tabular-nums">
          {user?.mobile ? `+${user.mobile}` : address?.mobile ? `+${address.mobile}` : "—"}
        </td>

        {/* Address */}
        <td data-label="ADDRESS" className="px-4 py-4">
          <div className="w-full max-w-[300px] flex flex-col items-end md:items-start">
            {address?.addressType && (
              <span className="bg-primary/5 text-primary rounded-md px-2 py-0.5 font-black text-[10px] uppercase tracking-widest mb-1.5 border border-primary/10">
                {address.addressType}
              </span>
            )}
            <p className="text-[12px] font-bold text-slate-500 leading-tight text-right md:text-left">
              {fullAddress || "—"}
            </p>
          </div>
        </td>

        {/* Pincode */}
        <td data-label="PINCODE" className="text-[13px] text-slate-600 font-black px-4 py-4 whitespace-nowrap tabular-nums">
          {address?.pincode || "—"}
        </td>

        {/* Total Amount */}
        <td data-label="TOTAL" className="text-[16px] text-primary px-4 py-4 whitespace-nowrap font-black tabular-nums">
          ${order?.totalAmt?.toFixed(2) || "0.00"}
        </td>

        {/* User ID */}
        <td data-label="USER ID" className="text-[11px] px-4 py-4 whitespace-nowrap text-slate-400 font-bold tabular-nums">
          {user?._id?.slice(-8) || "—"}
        </td>

        {/* Order Status */}
        <td data-label="STATUS" className="px-4 py-4">
          <div className="flex items-center gap-2 justify-end md:justify-start">
            <Select
              value={orderStatus}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ "aria-label": "Order Status" }}
              size="small"
              disabled={updating}
              className="!bg-white !rounded-xl !text-[12px] !font-black !h-[40px] !min-w-[120px] shadow-sm border-slate-100"
              sx={{ 
                '& .MuiSelect-select': { py: '8px', px: '12px' },
                '& fieldset': { border: '1px solid #f1f5f9 !important' },
                '&:hover fieldset': { borderColor: '#02B290 !important' }
              }}
            >
              <MenuItem value="confirm" className="!text-[13px] !font-bold">Confirm</MenuItem>
              <MenuItem value="ordered" className="!text-[13px] !font-bold">Ordered</MenuItem>
              <MenuItem value="delivered" className="!text-[13px] !font-bold">Delivered</MenuItem>
              <MenuItem value="cancelled" className="!text-[13px] !font-bold">Cancelled</MenuItem>
              <MenuItem value="pending" className="!text-[13px] !font-bold">Pending</MenuItem>
            </Select>
            {updating && <CircularProgress size={16} className="!text-primary" />}
          </div>
        </td>

        {/* Date */}
        <td data-label="DATE" className="text-[13px] text-slate-500 font-black px-4 py-4 whitespace-nowrap tabular-nums text-right md:text-left">
          <div className="flex items-center gap-1.5 justify-end md:justify-start">
            <MdDateRange size={16} className="text-slate-300" />
            {formattedDate}
          </div>
        </td>
      </tr>

      {/* Expanded products row */}
      {expendIndex && (
        <tr className="bg-gray-50">
          <td colSpan={11} className="px-6 py-4">
            <div className="flex flex-col gap-3">
              {order?.products?.length > 0 ? (
                order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                  >
                    {/* Product image */}
                    <div className="img rounded-md overflow-hidden w-[70px] h-[70px] flex-shrink-0 bg-gray-200">
                      {product?.image ? (
                        <Image
                          src={product.image}
                          alt={product?.productTitle}
                          width={70}
                          height={70}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px]">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 flex flex-col gap-0.5">
                      <h2 className="text-gray-900 text-[14px] font-[600]">
                        {product?.productTitle || "—"}
                      </h2>
                      <span className="text-gray-500 text-[13px]">
                        Unit Price: ${product?.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="text-[14px] text-gray-700 font-[500] min-w-[60px]">
                      X{product?.quantity}
                    </div>

                    {/* Sub total */}
                    <div className="text-[14px] text-gray-900 font-[600] min-w-[80px]">
                      ${product?.subTotal?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-[13px]">No products found.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderRow;
