"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { fetchDataFromApi } from "@/utils/api";

const CatSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res.success) {
        setCategories(res.data);
      }
    });
  }, []);

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center md:text-left">
            <h3 className="text-[18px] md:text-[22px] font-[600] text-gray-800 tracking-tight">Top Categories</h3>
            <p className="text-[12px] md:text-[14px] text-gray-400 font-[400]">New products with updated stocks.</p>
          </div>
          <Link 
            href="/products" 
            className="flex items-center gap-2 text-[13px] md:text-[14px] font-[500] text-gray-500 hover:text-primary transition-all group"
          >
            View All 
            <span className="text-[16px] md:text-[18px] transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <Swiper
          slidesPerView={10}
          spaceBetween={20}
          navigation={false}
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 15,
            },
            1200: {
              slidesPerView: 10,
              spaceBetween: 20,
            },
          }}
        >
          {categories?.length > 0 &&
            categories.map((cat, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link href={`/products?category=${cat._id}`} className="group flex flex-col items-center">
                    <div
                      className="p-5 w-full aspect-square rounded-[10px] bg-white border border-gray-50 flex items-center justify-center transition-all duration-300 group-hover:shadow-md overflow-hidden shadow-sm"
                    >
                      <Image
                        src={cat.images[0]}
                        alt={cat.name}
                        width={80}
                        height={80}
                        className="transition-all duration-500 group-hover:scale-110 object-contain w-full h-full"
                      />
                    </div>
                    <h4 className="text-[14px] font-[500] text-center mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300 px-2 line-clamp-1">
                      {cat.name}
                    </h4>
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </section>
  );
};

export default CatSlider;