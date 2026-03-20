"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import Image from "next/image";
import InnerImageZoom from "react-inner-image-zoom";
import "../app/zoomSlider.css";

const ProductZoom = ({ images = [] }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const gotToSlide = (index) => {
    setSlideIndex(index);
    if (zoomSliderSml.current?.swiper) {
      zoomSliderSml.current.swiper.slideTo(index);
    }
    if (zoomSliderBig.current?.swiper) {
      zoomSliderBig.current.swiper.slideTo(index);
    }
  };

  const imageList =
    Array.isArray(images) && images.length > 0 ? images : ["/product1.png"];

  return (
    <div className="imageWrapper w-full">
      <div className="isliderWrapper border border-gray-100 p-2 md:p-4 rounded-[32px] overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
        <Swiper 
          className="bigSlider" 
          ref={zoomSliderBig}
          onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
        >
          {imageList.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div className="item flex items-center justify-center p-2 rounded-2xl overflow-hidden aspect-square">
                <InnerImageZoom 
                  src={imgUrl} 
                  zoomSrc={imgUrl} 
                  zoomScale={1.5}
                  zoomType="hover"
                  fadeDuration={300}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="smlSliderWrapper mt-6 md:mt-8">
        <Swiper
          className="smlSlider !px-1"
          slidesPerView={4}
          spaceBetween={12}
          ref={zoomSliderSml}
          breakpoints={{
            480: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 5 },
          }}
        >
          {imageList.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div
                className={`group relative aspect-square rounded-[20px] cursor-pointer transition-all duration-300 overflow-hidden border-2 ${
                  slideIndex === index
                    ? "border-primary shadow-lg shadow-primary/10 ring-4 ring-primary/5"
                    : "border-gray-100 hover:border-gray-200"
                } bg-white p-1.5`}
                onClick={() => gotToSlide(index)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={imgUrl}
                    className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    alt="product image"
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductZoom;
