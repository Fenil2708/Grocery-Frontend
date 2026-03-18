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
    confirm: "text-blue-600",
    ordered: "text-yellow-600",
    delivered: "text-green-600",
    cancelled: "text-red-500",
    pending: "text-gray-500",
  };

  return (
    <>
      <tr className="border-b-[1px] border-[rgba(0,0,0,0.1)] hover:bg-gray-50">
        {/* Expand toggle */}
        <td className="text-[14px] text-gray-700 px-4 py-2 font-bold">
          <Button
            className="!min-w-[40px] !h-[40px] !w-[40px] !rounded-full !text-gray-500 !bg-gray-100 hover:!bg-gray-200"
            onClick={() => setExpendIndex(!expendIndex)}
          >
            <FaAngleDown
              size={20}
              className={`transition-all ${expendIndex ? "rotate-180" : ""}`}
            />
          </Button>
        </td>

        {/* Order ID */}
        <td className="text-[14px] text-gray-700 px-4 py-2 font-bold whitespace-nowrap">
          #{order?._id?.toString().slice(-6).toUpperCase()}
        </td>

        {/* Customer */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2">
          <div className="flex items-center gap-3 w-[260px]">
            <div className="rounded-full w-[45px] h-[45px] overflow-hidden flex-shrink-0 bg-gray-200">
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
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-[18px] font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="info flex flex-col gap-0">
              <span className="text-gray-800 text-[14px] font-[600]">
                {user?.name || "—"}
              </span>
              <span className="text-gray-500 text-[13px]">
                {user?.email || "—"}
              </span>
            </div>
          </div>
        </td>

        {/* Payment ID & Status */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="font-bold">{order?.paymentId || "—"}</span>
            <span className={`text-[11px] uppercase font-bold ${order?.payment_status?.toLowerCase() === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
              {order?.payment_status || "Pending"}
            </span>
          </div>
        </td>

        {/* Phone Number */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2 whitespace-nowrap">
          {user?.mobile ? `+${user.mobile}` : address?.mobile ? `+${address.mobile}` : "—"}
        </td>

        {/* Address */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2">
          <div className="w-[300px] py-2">
            {address?.addressType && (
              <span className="bg-gray-100 rounded-md px-2 py-1 border border-[rgba(0,0,0,0.1)] text-[12px] mb-1 inline-block">
                {address.addressType}
              </span>
            )}
            <p className="pt-1 text-[13px] leading-snug">
              {fullAddress || "—"}
            </p>
          </div>
        </td>

        {/* Pincode */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2 whitespace-nowrap">
          {address?.pincode || "—"}
        </td>

        {/* Total Amount */}
        <td className="text-[14px] text-gray-700 px-4 py-2 whitespace-nowrap font-bold">
          ${order?.totalAmt?.toFixed(2) || "0.00"}
        </td>

        {/* User ID */}
        <td className="text-[13px] px-4 py-2 whitespace-nowrap text-primary font-bold">
          {user?._id || "—"}
        </td>

        {/* Order Status */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2">
          <div className="flex items-center gap-2">
            <Select
              value={orderStatus}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ "aria-label": "Order Status" }}
              size="small"
              disabled={updating}
              sx={{ minWidth: 120, fontSize: "13px" }}
            >
              <MenuItem value="confirm">Confirm</MenuItem>
              <MenuItem value="ordered">Ordered</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
            {updating && <CircularProgress size={16} />}
          </div>
        </td>

        {/* Date */}
        <td className="text-[14px] text-gray-700 font-[500] px-4 py-2 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <MdDateRange size={18} />
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
