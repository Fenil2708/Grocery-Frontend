"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { fetchDataFromApi } from "@/utils/api";

const Banners = () => {

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/banner").then((res) => {
      setBanners(res.data);
    });
  }, []);

  return (
    <section className="py-5 bg-white pt-0">
      <div className="container">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {
            banners?.length !== 0 && banners?.map((banner, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link
                    href={banner.category ? `/products?category=${banner.category._id}` : banner.product ? `/product/${banner.product._id}` : "/"}
                    className="item group rounded-lg overflow-hidden w-full"
                  >
                    <Image
                      src={banner.images[0]}
                      alt="banner"
                      width={400}
                      height={180}
                      className="w-full transition group-hover:scale-105 rounded-md h-[150px] md:h-[180px] object-cover"
                    />
                  </Link>
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </div>
    </section>
  );
};

export default Banners;
