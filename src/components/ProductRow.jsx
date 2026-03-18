"use client";
import React, { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";
import Link from "next/link";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { fetchDataFromApi } from "@/utils/api";
import ProductSkeleton from "./ProductSkeleton";

const ProductRow = ({ title, categoryId, isFeatured, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/api/product";
    const params = new URLSearchParams();
    
    if (categoryId) params.append("category", categoryId);
    if (isFeatured) params.append("isFeatured", "true");
    if (categoryName) params.append("categoryName", categoryName);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    fetchDataFromApi(url).then((res) => {
      if (res?.success) {
        setProducts(res.data);
      }
      setLoading(false);
    });
  }, [categoryId, isFeatured, categoryName]);

  if (loading) {
    return (
      <section className="bg-white py-3">
        <div className="container">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] text-gray-800 font-[500]">{title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-3">
      <div className="container">
        <div className="flex items-center justify-between mb-5 gap-3">
          <h2 className="text-[18px] md:text-[20px] text-gray-800 font-[500]">{title}</h2>
          <Link
            href={
              categoryId 
                ? `/products?category=${categoryId}` 
                : isFeatured 
                ? `/products?isFeatured=true`
                : categoryName
                ? `/products?categoryName=${categoryName}`
                : "/products"
            }
            className="flex items-center gap-1 text-[14px] md:text-[16px] text-gray-700 font-[500] hover:text-primary whitespace-nowrap"
          >
            View All <MdOutlineArrowRightAlt size={22} className="md:w-[25px] md:h-[25px]" />
          </Link>
        </div>
        <ProductSlider products={products} />
      </div>
    </section>
  );
};

export default ProductRow;