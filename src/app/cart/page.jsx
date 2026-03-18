"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import CartItems from "./cartItems";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { MyContext } from "@/context/ThemeProvider";

const Cart = () => {
  const context = useContext(MyContext);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (context.cartData?.length > 0) {
      const total = context.cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [context.cartData]);

  return (
    <section className="bg-gray-50 py-6 md:py-10 min-h-[80vh]">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-10 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[24px] md:text-[28px] text-gray-800 font-black tracking-tight leading-none">
                        Shopping Cart
                        </h2>
                        <p className="text-[13px] text-gray-400 mt-3 font-medium uppercase tracking-widest flex items-center gap-2">
                        Items in bag: <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md min-w-[24px] text-center">{context.cartData?.length || 0}</span>
                        </p>
                    </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                {context.cartData?.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {context.cartData.map((item, index) => (
                        <CartItems key={index} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="py-32 px-6 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-4xl transform group-hover:scale-110 transition-transform duration-500">🛒</span>
                    </div>
                    <h3 className="text-[22px] text-gray-800 font-black tracking-tight">Your cart is empty</h3>
                    <p className="text-gray-400 max-w-[280px] mx-auto mt-2 italic font-medium leading-relaxed">Looks like you haven&apos;t added anything to your cart yet.</p>
                    <Link href="/">
                        <Button className="!bg-primary !text-white !font-black !px-12 !py-4 !rounded-[20px] !mt-10 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 !capitalize !text-[15px]">
                            Continue Shopping
                        </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {context.cartData?.length > 0 && (
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-gray-100 p-8 md:p-10 sticky top-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <h2 className="text-[20px] md:text-[22px] text-gray-800 font-black mb-8 tracking-tight">Order Summary</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between text-[15px] font-black uppercase tracking-widest text-gray-300">
                        <span>Subtotal</span>
                        <span className="text-gray-800 font-black tabular-nums">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[15px] font-black uppercase tracking-widest text-gray-300 pb-6 border-b border-gray-50">
                        <span>Shipping</span>
                        <span className="text-green-500 font-black tracking-widest">FREE</span>
                    </div>
                    
                    <div className="pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[18px] font-black text-gray-800 tracking-tight">Total Payable</span>
                            <span className="text-primary text-[32px] font-black tabular-nums">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end mt-1 text-gray-400 italic font-medium text-[12px]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04Customizable0a2.238 2.238 0 002.147 2.147h11.07a2.238 2.238 0 002.147-2.147V6.928z"/></svg>
                            Tax included where applicable
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <Link href={"/checkout"}>
                        <Button className="!bg-primary !text-white !font-black !w-full !py-4.5 !rounded-[24px] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.97] !capitalize text-[17px] !h-[64px]">
                            Checkout Now
                        </Button>
                    </Link>
                    <div className="flex items-center justify-center gap-3 mt-6 text-gray-300 font-black uppercase tracking-[0.2em] text-[10px]">
                        <span className="w-8 h-px bg-gray-100"></span>
                        Secure Payment
                        <span className="w-8 h-px bg-gray-100"></span>
                    </div>
                    <div className="flex justify-center gap-4 mt-6 opacity-30 grayscale contrast-125">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" width={50} height={16} className="h-4 w-auto" alt="Visa"/>
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" width={40} height={24} className="h-6 w-auto" alt="Mastercard"/>
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width={60} height={16} className="h-4 w-auto" alt="Paypal"/>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
