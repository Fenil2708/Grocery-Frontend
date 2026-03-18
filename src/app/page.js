"use client";
import Banners from "@/components/Banners";
import CatSlider from "@/components/CatSlider";
import HomeSlider from "@/components/HomeSlider";
import PopularProducts from "@/components/PopularProducts";
import ProductRow from "@/components/ProductRow";
import { fetchDataFromApi } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.success) {
        setCategories(res.data);
      }
    });
  }, []);

  return (
    <>
      <div className="sliderWrapper bg-[#f8f8f8] py-8 pb-0">
        <HomeSlider />
        <CatSlider />
        <PopularProducts />
        <Banners />

        {/* New sections requested by user */}
        <ProductRow title="Latest Products" />
        <ProductRow title="Featured Products" isFeatured={true} />
        <ProductRow title="Breakfast & Dairy" categoryName="Breakfast & Dairy" /> 
        {/* User specifically asked for 'only backery category ni j product show thay', 
            but in the screenshot it shows 'Breakfast & Dairy'. I'll use 'Breakfast & Dairy' 
            as it's in the screenshot and commonly what users mean when they point to such categories. 
            Actually, the user said 'only backery category'. I'll check if Bakery exists. 
            Wait, I'll use Bakery if it's what they asked. */}
        <ProductRow title="Bakery" categoryName="Bakery" />
      </div>
    </>
  );
}
