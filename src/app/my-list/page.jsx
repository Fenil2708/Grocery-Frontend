"use client";
import AccountSidebar from "@/components/AccountSidebar";
import { MyContext } from "@/context/ThemeProvider";
import { Button } from "@mui/material";
import React, { useContext } from "react";
import { Rating } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { deleteData } from "@/utils/api"; // Make sure to import your API function

const MyList = () => {
  const context = useContext(MyContext);

  const removeFromList = async (productId) => {
    try {
      const res = await context.deleteFromMyList(productId);
      if (res.success) {
        context.alertBox('success', 'Removed from My List');
      } else {
        context.alertBox('error', res.message || 'Failed to remove from My List');
      }
    } catch (error) {
      console.log(error);
      context.alertBox('error', 'An error occurred while removing item');
    }
  }

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
                <h4 className="text-[22px] font-black text-gray-800 tracking-tight leading-none">
                  My Wishlist
                </h4>
                <p className="text-[13px] text-gray-400 mt-2 font-medium flex items-center gap-2 uppercase tracking-widest">
                  Items saved: <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md min-w-[24px] text-center">{context.myListData?.length || 0}</span>
                </p>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {context.myListData?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {context.myListData.map((item, index) => {
                    if (!item.productId) return null;
                    const product = item.productId;
                    
                    return (
                        <div key={product._id || index} className="group relative flex flex-col sm:flex-row items-center gap-6 p-5 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-primary/20 transition-all duration-500">
                        <Link href={`/product/${product._id}`} className="img w-full sm:w-[120px] h-[140px] shrink-0 rounded-2xl overflow-hidden bg-gray-50 p-4 flex items-center justify-center relative">
                            <img
                            src={product.images?.[0] || "/product1.png"}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            />
                            {product.discount > 0 && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">-{product.discount}%</span>
                            )}
                        </Link>

                        <div className="info flex flex-col gap-1.5 flex-1 min-w-0 text-center sm:text-left">
                            <span className="text-[11px] font-black text-gray-300 tracking-[0.2em] uppercase">{product.brand || product.category?.name || "Premium Brand"}</span>
                            <Link href={`/product/${product._id}`} className="text-[16px] md:text-[18px] text-gray-800 font-black hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                            </Link>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <Rating name="read-only" value={product.rating || 0} readOnly size="small" className="!text-[14px]" />
                                <span className="text-[12px] text-gray-400 font-bold">(4.5)</span>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                                <span className="text-primary text-[20px] font-black tracking-tight">${product.price?.toFixed(2)}</span>
                                {product.oldPrice > 0 && (
                                    <span className="text-gray-300 text-[14px] font-bold line-through tracking-wider">${product.oldPrice?.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="sm:pl-6 sm:border-l border-gray-50 flex flex-row sm:flex-col gap-3">
                            <Button 
                                className="!bg-primary !text-white !font-black !px-6 !py-3 !rounded-2xl hover:!bg-secondary transition-all !capitalize !text-[13px] shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95"
                                onClick={() => context.addToCart(product)}
                            >
                                Add to Cart
                            </Button>
                            <Button 
                                onClick={() => removeFromList(product._id)} 
                                className="!w-[48px] !h-[48px] !min-w-[48px] !rounded-2xl !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white transition-all border border-red-100 flex items-center justify-center active:scale-95 group/del"
                                title="Remove from wishlist"
                            >
                                <IoMdClose size={20} className="group-hover/del:rotate-90 transition-transform" />
                            </Button>
                        </div>
                        </div>
                    );
                    })}
                </div>
              ) : (
                <div className="text-center py-24 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-white shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <IoMdClose className="text-gray-200 transform group-hover:rotate-90 transition-transform duration-500" size={48} />
                  </div>
                  <h4 className="text-[22px] font-black text-gray-800 tracking-tight">Your wishlist is empty</h4>
                  <p className="text-gray-400 font-medium max-w-[280px] mx-auto mt-2 italic">Add items you love to find them easily and checkout when you&apos;re ready.</p>
                  <Link href="/">
                    <Button className="!bg-primary !text-white !font-black !px-12 !py-4 !rounded-[20px] hover:!bg-secondary transition-all !capitalize shadow-2xl shadow-primary/30 mt-10 active:scale-95">Continue Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;