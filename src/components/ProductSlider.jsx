"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "./ProductItem";

const ProductSlider = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-4 text-center text-gray-400 text-[14px]">
        No products available.
      </div>
    );
  }

  return (
    <div className="productSlider">
      <Swiper
        slidesPerView={6}
        spaceBetween={5}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 8 },
          640: { slidesPerView: 3, spaceBetween: 8 },
          1024: { slidesPerView: 5, spaceBetween: 5 },
          1280: { slidesPerView: 6, spaceBetween: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="py-3 px-2">
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
