"use client";
import Sidebar from "@/components/Sidebar";
import { Button } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ProductItem from "@/components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { fetchDataFromApi } from "@/utils/api";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const ProductPage = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const isFeaturedParam = searchParams.get("isFeatured");
  const categoryNameParam = searchParams.get("categoryName");

  const [sortBy, setSortBy] = useState("Name, A to Z");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Category filter state (controlled by Sidebar)
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );

  // Price filter state
  const [priceRange, setPriceRange] = useState([0, 30000]);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);

    let url = "/api/product";
    const params = new URLSearchParams();

    if (selectedCategories.length === 1) {
      params.append("category", selectedCategories[0]);
    }
    
    if (searchParam) {
      params.append("search", searchParam);
    }

    if (isFeaturedParam) {
      params.append("isFeatured", isFeaturedParam);
    }

    if (categoryNameParam) {
      params.append("categoryName", categoryNameParam);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetchDataFromApi(url).then((res) => {
      if (res?.success) {
        setProducts(res.data);
      }
      setLoading(false);
    });
  }, [selectedCategories, searchParam, isFeaturedParam, categoryNameParam]);


  // Sort + price filter products
  useEffect(() => {
    let result = [...products];

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === "Name, A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Name, Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "Price Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
    setPage(1);
  }, [products, sortBy, priceRange]);

  const handleSortSelect = (label) => {
    setSortBy(label);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (_, val) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <section className="py-5 bg-white">
      <div className="container lg:flex gap-4">
        <div className={`sidebarWrapper fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-[100] lg:z-10 bg-white w-[280px] lg:w-[22%] translate-x-[-100%] lg:translate-x-0 transition-all duration-300 ${isSidebarOpen && '!translate-x-0'} shadow-xl lg:shadow-none overflow-y-auto lg:overflow-visible`}>
          <div className="p-4 lg:hidden border-b flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
             <h3 className="font-bold">Filters</h3>
             <Button onClick={() => setIsSidebarOpen(false)}>Close</Button>
          </div>
          <Sidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-[90] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <div className="rightContent flex-1">
          <div className="lg:hidden mb-4">
             <Button onClick={() => setIsSidebarOpen(true)} className="!bg-primary !text-white !font-bold !w-full !py-3 !rounded-xl shadow-lg shadow-primary/20 !capitalize">Open Filters</Button>
          </div>
          {/* Top strip */}
          <div className="top-strip w-full bg-gray-50/80 backdrop-blur-sm border border-gray-100 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 sticky top-[100px] lg:top-[120px] z-[48] gap-4 shadow-sm">
            <span className="text-[13px] md:text-[14px] text-gray-400 font-bold uppercase tracking-wider">
              {loading
                ? "Searching..."
                : `${filteredProducts.length} Results found`}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[14px] text-gray-500 font-bold">
                Sort:
              </span>
              <div className="relative">
                <Button
                  className="!bg-white !capitalize !text-gray-800 !py-1.5 !px-5 !rounded-lg !border !border-gray-100 shadow-sm !font-bold !text-[13px] hover:!border-primary/30 transition-all"
                  onClick={handleClick}
                >
                  {sortBy}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  {["Name, A to Z", "Name, Z to A", "Price Low to High", "Price High to Low"].map(
                    (option) => (
                      <MenuItem
                        key={option}
                        onClick={() => handleSortSelect(option)}
                        selected={sortBy === option}
                      >
                        {option}
                      </MenuItem>
                    )
                  )}
                </Menu>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 py-8">
              {[...Array(10)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 py-8">
              {paginatedProducts.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-[18px] font-[500]">No products found.</p>
              <p className="text-[14px] mt-1">Try adjusting your filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-5">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
