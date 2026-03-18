"use client";
import { Button, Rating, Menu, MenuItem } from "@mui/material";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "@/context/ThemeProvider";
import { deleteData, putData } from "@/utils/api";
import Image from "next/image";

const CartItems = ({ item }) => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (qty) => {
    setAnchorEl(null);
    if (qty && qty !== item.quantity) {
      updateQty(qty);
    }
  };

  const updateQty = async (qty) => {
    try {
      const res = await context.updateCartQty(item.productId._id, qty);
      if (res.success) {
        context.alertBox("success", "Cart updated");
      } else {
        context.alertBox("error", res.message || "Failed to update cart");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const removeItem = async (id) => {
    try {
      const res = await context.removeFromCart(id);
      if (res.success) {
        context.alertBox("success", "Item removed");
      } else {
        context.alertBox("error", res.message || "Failed to remove item");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!item || !item.productId) return null;

  const product = item.productId;
  const imageUrl = product.images?.[0] || "/product1.png";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 hover:bg-gray-50/50 transition-all group relative">
      <Link href={`/product/${product._id}`} className="img w-full sm:w-[140px] aspect-square shrink-0 rounded-[24px] overflow-hidden bg-gray-50 p-4 flex items-center justify-center relative group/img">
        <Image
          src={imageUrl}
          alt={product.name}
          width={120}
          height={120}
          className="w-full h-full transition-transform duration-700 group-hover/img:scale-110 object-contain"
          unoptimized
        />
        {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg">-{product.discount}%</span>
        )}
      </Link>

      <div className="info flex flex-col gap-2 flex-1 min-w-0 text-center sm:text-left">
        <span className="text-[11px] font-black text-gray-300 tracking-[0.2em] uppercase">
          {product.brand || "Premium Brand"}
          {product.sku_id && ` | SKU: ${product.sku_id}`}
        </span>
        <Link
          href={`/product/${product._id}`}
          className="text-[17px] md:text-[19px] text-gray-800 font-black hover:text-primary transition-colors line-clamp-2 leading-tight"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Rating name="read-only" value={product.rating || 0} readOnly size="small" className="!text-[14px]" />
          <span className="text-[12px] text-gray-400 font-bold">(4.5)</span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 md:gap-10 mt-4">
          <div className="relative">
            <Button
              className="!bg-white !border-2 !border-gray-100 !text-gray-800 !py-2 !px-5 !capitalize !rounded-2xl !text-[14px] !font-black hover:!border-primary/30 transition-all shadow-sm active:scale-95 flex items-center gap-2"
              onClick={handleClick}
            >
              <span className="text-gray-400 text-[11px] uppercase tracking-widest mr-1">Qty</span>
              {item.quantity}
              <IoMdArrowDropdown size={20} className="text-primary transition-transform group-hover:rotate-180" />
            </Button>
            <Menu
              id="qtyDrop"
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleClose()}
              PaperProps={{
                  sx: { 
                    borderRadius: '20px', 
                    mt: 1, 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6',
                    minWidth: '100px'
                  }
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <MenuItem key={val} onClick={() => handleClose(val)} className={`!text-[14px] !px-6 !py-3 !font-bold ${item.quantity === val ? '!text-primary !bg-primary/5' : '!text-gray-600'}`}>
                  {val}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Price</span>
            <div className="flex items-baseline gap-2">
                <span className="text-gray-800 text-[18px] font-black tabular-nums">
                ${item.price?.toFixed(2)}
                </span>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-gray-100"></div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Subtotal</span>
            <span className="text-primary font-black text-[20px] tabular-nums">${item.subTotal?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center sm:pl-6 sm:border-l border-gray-50">
          <Button 
            className="!w-[48px] !h-[48px] !min-w-[48px] !rounded-[18px] !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white transition-all border border-red-100 active:scale-95 shadow-sm group/del" 
            onClick={() => removeItem(product._id)}
            title="Remove from cart"
          >
            <IoMdClose size={22} className="group-hover/del:rotate-90 transition-transform" />
          </Button>
      </div>

    </div>
  );
};

export default CartItems;
