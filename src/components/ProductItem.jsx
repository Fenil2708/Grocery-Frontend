"use client";
import Link from "next/link";
import React, { useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import Image from "next/image";
import { Button } from "@mui/material";
import { MyContext } from "@/context/ThemeProvider";
import { postData, deleteData } from "@/utils/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductItem = ({ product }) => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const isAddedToMyList = context.myListData?.some(item => item.productId?._id === product._id);

  const addToMyList = async () => {
    if (!context.isLogin) {
      context.alertBox('error', 'Please login to add to My List');
      return;
    }

    try {
      let res;
      if (isAddedToMyList) {
        res = await context.deleteFromMyList(product._id);
        if (res.success) {
          context.alertBox('success', 'Removed from My List');
        }
      } else {
        res = await context.addToMyList(product._id);
        if (res.success) {
          context.alertBox('success', 'Added to My List');
        }
      }

      if (!res.success) {
        context.alertBox('error', res.message || 'Failed to update My List');
      }
    } catch (error) {
      console.log(error);
      context.alertBox('error', 'Error updating My List');
    }
  }

  const addToCart = async (productId) => {
    if (!context.isLogin) {
      context.alertBox('error', 'Please login to add to cart');
      return;
    }
    setLoading(true);
    try {
      const res = await context.addToCart(productId, 1);
      if (res.success) {
        context.alertBox('success', 'Added to Cart');
      } else {
        context.alertBox('error', res.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.log(error);
      context.alertBox('error', 'Error adding to cart');
    } finally {
      setLoading(false);
    }
  }

  if (!product) return null;

  const imageUrl = product.images?.[0] || "/product1.png";
  const discount = product.discount > 0 ? product.discount : null;

  return (
    <div className="productItem bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col group relative h-full">
      <Link href={`/product/${product._id}`} className="img block relative p-4 bg-gray-50/50 group-hover:bg-white transition-colors duration-500">
        {discount && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg z-10 shadow-lg shadow-red-200 uppercase tracking-wider">
            {discount}% OFF
          </span>
        )}
        
        <div 
          className="absolute top-4 right-4 z-20 cursor-pointer w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-50 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-300" 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToMyList(); }}
        >
          {isAddedToMyList ? <FaHeart size={18} className="text-red-500" /> : <FaRegHeart size={18} />}
        </div>

        <div className="relative aspect-square overflow-hidden rounded-xl">
           <Image
             src={imageUrl}
             alt={product.name || "product image"}
             width={300}
             height={300}
             className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
             unoptimized
           />
        </div>
      </Link>

      <div className="info p-4 md:p-5 flex flex-col flex-1">
        <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{product.brand || product.category?.name || "Global Brand"}</span>
        <Link
          href={`/product/${product._id}`}
          className="text-[14px] md:text-[15px] text-gray-800 font-bold hover:text-primary transition-colors line-clamp-2 min-h-[42px] leading-tight"
        >
          {product.name}
        </Link>
        
        <div className="flex items-center gap-2 my-2">
            <Rating name="read-only" value={product.rating || 0} readOnly size="small" className="!text-[14px] opacity-80" />
            <span className="text-[11px] font-bold text-gray-300">(0)</span>
        </div>

        <div className="mt-auto pt-3">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-red-500 text-[18px] md:text-[20px] font-black">${product.price?.toFixed(2)}</span>
              {product.oldPrice > 0 && (
                <span className="text-gray-300 text-[13px] md:text-[14px] font-bold line-through">${product.oldPrice?.toFixed(2)}</span>
              )}
            </div>

            <Button 
                className={`!w-full !py-2.5 !rounded-xl !text-[13px] md:!text-[14px] !font-black !capitalize transition-all duration-300 ${
                    product.countInStock === 0 
                    ? "!bg-gray-100 !text-gray-400 !cursor-not-allowed" 
                    : "!bg-primary/5 !text-primary hover:!bg-primary hover:!text-white shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                }`} 
                onClick={() => addToCart(product._id)} 
                disabled={loading || product.countInStock === 0}
            >
                {loading ? 'Adding...' : (product.countInStock === 0 ? 'Sold Out' : 'Add To Cart')}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
