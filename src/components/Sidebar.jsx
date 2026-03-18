"use client";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LiaAngleDownSolid } from "react-icons/lia";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Collapse } from "react-collapse";
import { TfiAngleUp } from "react-icons/tfi";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { IoIosStar } from "react-icons/io";
import { fetchDataFromApi } from "@/utils/api";

const Sidebar = ({
  selectedCategories = [],
  onCategoryChange,
  priceRange = [0, 30000],
  onPriceChange,
}) => {
  const [isOpenCatFilter, setIsOpenCatFilter] = useState(true);
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.success) {
        setCategories(res.data);
      }
    });
  }, []);

  const handleCategoryToggle = (catId) => {
    if (!onCategoryChange) return;
    const isSelected = selectedCategories.includes(catId);
    if (isSelected) {
      onCategoryChange(selectedCategories.filter((id) => id !== catId));
    } else {
      onCategoryChange([...selectedCategories, catId]);
    }
  };

  return (
    <aside className="lg:sticky lg:top-[160px] flex flex-col gap-8 pb-10 pr-2">
      {/* Category Filter */}
      <div className="filter-group">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[14px] font-black text-gray-800 uppercase tracking-widest">
            Categories
          </h3>
          <Button
            className="!min-w-[32px] !w-[32px] !h-[32px] !rounded-lg !text-gray-400 !bg-gray-50 hover:!bg-primary/10 hover:!text-primary transition-all"
            onClick={() => setIsOpenCatFilter(!isOpenCatFilter)}
          >
            <LiaAngleDownSolid size={18} className={`transition-transform duration-300 ${isOpenCatFilter ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <Collapse isOpened={isOpenCatFilter}>
          <div className="scroll overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            <FormGroup className="flex flex-col gap-0.5">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                        <Checkbox
                            checked={selectedCategories.includes(cat._id)}
                            onChange={() => handleCategoryToggle(cat._id)}
                            className="!p-0 !text-gray-200 checked:!text-primary"
                            sx={{
                                '&.Mui-checked': {
                                color: '#2b3445', // Use a primary-like color or whatever is the theme's primary
                                },
                            }}
                        />
                        <span className={`text-[14px] font-semibold transition-colors ${selectedCategories.includes(cat._id) ? 'text-primary' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {cat.name}
                        </span>
                  </label>
                ))
              ) : (
                <div className="space-y-3 py-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-50 rounded-full animate-pulse w-full"></div>)}
                </div>
              )}
            </FormGroup>
          </div>
        </Collapse>
      </div>

      {/* Price Filter */}
      <div className="filter-group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[14px] font-black text-gray-800 uppercase tracking-widest">
            Price Range
          </h3>
        </div>

        <div className="px-1">
            <RangeSlider
            value={priceRange}
            onInput={onPriceChange || (() => {})}
            min={0}
            max={30000}
            step={5}
            className="custom-range-slider"
            />
        </div>

        <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Min</span>
                <span className="text-gray-800 font-bold text-[14px]">$ {priceRange[0]}</span>
            </div>
            <div className="w-8 h-[1px] bg-gray-100 italic font-black text-gray-200"></div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Max</span>
                <span className="text-gray-800 font-bold text-[14px]">$ {priceRange[1]}</span>
            </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="filter-group">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[14px] font-black text-gray-800 uppercase tracking-widest">
            Rating
          </h3>
          <Button
            className="!min-w-[32px] !w-[32px] !h-[32px] !rounded-lg !text-gray-400 !bg-gray-50 hover:!bg-primary/10 hover:!text-primary transition-all"
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            <LiaAngleDownSolid size={18} className={`transition-transform duration-300 ${isOpenRatingFilter ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <Collapse isOpened={isOpenRatingFilter}>
          <div className="flex flex-col gap-1">
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors group">
                    <Checkbox className="!p-0 !text-gray-200" />
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <IoIosStar key={i} size={16} className={i < stars ? "text-yellow-400" : "text-gray-100"} />
                        ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-300 ml-auto">& up</span>
              </label>
            ))}
          </div>
        </Collapse>
      </div>
    </aside>
  );
};

export default Sidebar;
