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
    <div className="imageWrapper w-full lg:w-[40%]">
      <div className="isliderWrapper border border-[rgba(0,0,0,0.2)] p-5 rounded-lg overflow-hidden">
        <Swiper className="bigSlider" ref={zoomSliderBig}>
          {imageList.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <InnerImageZoom src={imgUrl} zoomSrc={imgUrl} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="smlSliderWrapper pt-4">
        <Swiper
          className="smlSlider"
          slidesPerView={4}
          spaceBetween={10}
          ref={zoomSliderSml}
          breakpoints={{
            480: {
              slidesPerView: 4,
            },
            640: {
              slidesPerView: 5,
            },
          }}
        >
          {imageList.map((imgUrl, index) => (
            <SwiperSlide key={index}>
              <div
                className={`item border ${
                  slideIndex === index
                    ? "border-primary"
                    : "border-[rgba(0,0,0,0.1)]"
                }  p-2 md:p-3 cursor-pointer rounded-md transition-all hover:border-[rgba(0,0,0,0.4)] bg-white`}
                onClick={() => gotToSlide(index)}
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={imgUrl}
                    className="object-contain"
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
