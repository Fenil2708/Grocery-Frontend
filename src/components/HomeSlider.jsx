"use client";
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import Image from 'next/image';
import { Navigation, Autoplay } from "swiper/modules";
import { fetchDataFromApi } from '@/utils/api';
import Link from 'next/link';

const HomeSlider = () => {

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/homeSlider").then((res) => {
      setSlides(res.data);
    });
  }, []);

  return (
    <div className='homeSlider'>
        <div className='container'>
            <div className="rounded-[20px] overflow-hidden shadow-sm">
                <Swiper 
                navigation={true} 
                modules={[Navigation, Autoplay]}
                autoplay={{
                    delay: 2500, 
                    disableOnInteraction: false,
                }}
                className='mySwiper'>
                {
                    slides?.length !== 0 && slides?.map((slide, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <Link href={slide.category ? `/products?category=${slide.category._id}` : slide.product ? `/product/${slide.product._id}` : "/"}>
                                    <div className='item bg-white'>
                                        <Image src={slide.images[0]} alt='slide' width={1344} height={514} className='w-full object-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px]'/>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        )
                    })
                }
                </Swiper>
            </div>
        </div>
    </div>
  )
}

export default HomeSlider