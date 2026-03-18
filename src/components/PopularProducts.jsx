"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductSlider from "./ProductSlider";
import ProductSkeleton from "./ProductSkeleton";
import { fetchDataFromApi } from "@/utils/api";

const PopularProducts = () => {
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch all categories on mount
  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.success && res.data?.length > 0) {
        setCategories(res.data);
      }
    });
  }, []);

  // Whenever the selected tab changes, fetch products for that category
  useEffect(() => {
    if (categories.length === 0) return;

    const selectedCategory = categories[value];
    if (!selectedCategory) return;

    setLoadingProducts(true);
    fetchDataFromApi(`/api/product?category=${selectedCategory._id}`).then(
      (res) => {
        if (res?.success) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
        setLoadingProducts(false);
      }
    );
  }, [value, categories]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section className="bg-white py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-4">
          <div className="col1 w-full md:w-[30%] text-center md:text-left">
            <h2 className="text-[18px] md:text-[20px] text-gray-800 font-[500]">
              Popular Products
            </h2>
            <p className="text-[12px] md:text-[14px] text-gray-500">
              Do not miss the current offers
            </p>
          </div>

          <div className="col2 w-full md:w-[70%] flex items-center justify-center md:justify-end">
            {categories.length > 0 && (
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="category tabs"
                className="w-full"
              >
                {categories.map((cat, index) => (
                  <Tab key={cat._id} label={cat.name} className="!text-[12px] md:!text-[14px] !min-w-0" />
                ))}
              </Tabs>
            )}
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductSlider products={products} />
        )}
      </div>
    </section>
  );
};

export default PopularProducts;