 "use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import ProductZoom from "./ProductZoom";
import { Button, Rating, Tooltip, TextField } from "@mui/material";
import QtyBox from "./QtyBox";
import { IoCartOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MyContext } from "@/context/ThemeProvider";

const ProductDetailsComponent = ({
  product,
  loadingProduct,
  reviews = [],
  avgRating = 0,
  totalReviews = 0,
  loadingReviews,
  onSubmitReview,
}) => {
  const context = useContext(MyContext);
  const [isActiveTab, setIsActiveTab] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [productQty, setProductQty] = useState(1);

  const isAddedToMyList = product
    ? context?.myListData?.some(
        (item) => item.productId?._id === product._id
      )
    : false;

  const addToMyList = async () => {
    if (!product || !context) return;
    if (!context.isLogin) {
      context.alertBox("error", "Please login to manage wishlist");
      return;
    }

    try {
      if (isAddedToMyList) {
        const res = await context.deleteFromMyList(product._id);
        if (!res?.success) {
          context.alertBox("error", res?.message || "Failed to update My List");
        }
      } else {
        const res = await context.addToMyList(product._id);
        if (!res?.success) {
          context.alertBox("error", res?.message || "Failed to update My List");
        }
      }
    } catch (error) {
      console.error(error);
      context.alertBox("error", "Error updating My List");
    }
  };

  const addToCart = async () => {
    if (!product || !context) return;
    if (!context.isLogin) {
      context.alertBox("error", "Please login to add to cart");
      return;
    }
    try {
      const res = await context.addToCart(product._id, productQty);
      if (!res?.success) {
        context.alertBox("error", res?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      context.alertBox("error", "Error adding to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmitReview || !product) return;

    if (!context?.isLogin) {
      context?.alertBox("error", "Please login to add a review");
      return;
    }

    if (!reviewText.trim() || !ratingValue) {
      context?.alertBox("error", "Please add review text and rating");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await onSubmitReview({
        review: reviewText.trim(),
        rating: ratingValue,
      });

      if (res?.success) {
        setReviewText("");
        setRatingValue(0);
        context?.alertBox("success", res?.message || "Review added");
      } else {
        context?.alertBox("error", res?.message || "Failed to add review");
      }
    } catch (error) {
      console.error(error);
      context?.alertBox("error", "Error adding review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[40%] h-[320px] md:h-[450px] bg-gray-100 animate-pulse rounded-lg" />
        <div className="flex-1 w-full space-y-4">
          <div className="h-8 bg-gray-100 rounded-md w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-100 rounded-md w-1/2 animate-pulse" />
          <div className="h-6 bg-gray-100 rounded-md w-1/3 animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-md w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <p className="text-center text-gray-600 py-10">
        Product not found or failed to load.
      </p>
    );
  }

  const brandLabel = product.brand || product.category?.name || "Unknown";
  const currentRating = avgRating || product.rating || 0;

  return (
    <>
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="w-full lg:w-[45%] shrink-0">
          <ProductZoom images={product.images} />
        </div>

        <div className="content flex-1 py-2">
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">In Stock</span>
                <span className="text-[12px] font-bold text-gray-300">|</span>
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{brandLabel}</span>
                {product.sku_id && (
                  <>
                    <span className="text-[12px] font-bold text-gray-300">|</span>
                    <span className="text-[12px] font-bold text-gray-500 tracking-wider">SKU: {product.sku_id}</span>
                  </>
                )}
            </div>

          <h1 className="text-[28px] md:text-[36px] font-black text-gray-800 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-lg">
                <Rating name="read-only" value={currentRating} readOnly size="small" className="!text-[16px]" />
                <span className="text-[13px] font-black text-yellow-700">{currentRating.toFixed(1)}</span>
            </div>
            <span
              className="text-[13px] md:text-[14px] font-bold cursor-pointer text-gray-400 hover:text-primary transition-colors underline underline-offset-4"
              onClick={() => setIsActiveTab(1)}
            >
              {totalReviews} Customer Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-8 bg-slate-50/80 backdrop-blur-sm p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
              <span className="text-primary text-[36px] md:text-[48px] font-black leading-none tracking-tighter">
                ${Number(product.price || 0).toFixed(2)}
              </span>
              {product.oldPrice > 0 && (
                <div className="flex flex-col">
                    <span className="text-slate-300 text-[18px] md:text-[22px] font-bold line-through leading-none">
                    ${Number(product.oldPrice || 0).toFixed(2)}
                    </span>
                    <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-md mt-2 uppercase tracking-widest inline-block w-fit">Save {(100 - (product.price/product.oldPrice * 100)).toFixed(0)}%</span>
                </div>
              )}
          </div>

          <div className="mb-10">
              <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-3">Description</h4>
              <p className="text-[14px] md:text-[16px] font-medium text-gray-500 leading-relaxed line-clamp-4">
                {product.description}
              </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="shrink-0">
              <QtyBox value={productQty} onChange={(val) => setProductQty(val)} />
            </div>
            
            <Button 
                className={`!flex-1 !h-[56px] !rounded-2xl !text-[16px] !font-black !capitalize shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${
                    product.countInStock === 0 
                    ? '!bg-gray-100 !text-gray-400 !cursor-not-allowed !shadow-none' 
                    : '!bg-primary !text-white shadow-primary/20'
                }`} 
                onClick={addToCart}
                disabled={product.countInStock === 0}
            >
              <IoCartOutline size={24} className="mr-2" />
              {product.countInStock > 0 ? 'Add to cart' : 'Sold Out'}
            </Button>

            <Tooltip title="Add to Wishlist" placement="top">
              <Button
                className="!w-[56px] !min-w-[56px] !h-[56px] !rounded-2xl !bg-white !border-2 !border-gray-100 !text-gray-400 hover:!border-red-100 hover:!text-red-500 hover:!bg-red-50 transition-all shadow-sm"
                onClick={addToMyList}
              >
                {isAddedToMyList ? (
                  <FaHeart size={24} className="text-red-500" />
                ) : (
                  <FaRegHeart size={24} />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>

      <div className="flex items-center gap-8 mt-8 mb-5">
        <span
          className={`text-[18px] font-[500] cursor-pointer flex pb-1 border-b-2 ${
            isActiveTab === 0
              ? "border-primary text-primary"
              : " text-gray-800 border-transparent"
          }`}
          onClick={() => setIsActiveTab(0)}
        >
          Description
        </span>
        <span
          className={`text-[18px] font-[500] cursor-pointer flex pb-1 border-b-2 ${
            isActiveTab === 1
              ? "border-primary text-primary"
              : " text-gray-800 border-transparent"
          }`}
          onClick={() => setIsActiveTab(1)}
        >
          Reviews
        </span>
      </div>

      {isActiveTab === 0 && (
        <div className="bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-gray-100">
           <p className="text-[14px] md:text-[16px] font-normal text-gray-600 leading-relaxed md:leading-loose w-full lg:w-[90%]">
            {product.description}
          </p>
        </div>
      )}

      {isActiveTab === 1 && (
        <div className="reviewSection w-full lg:w-[90%] flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <h2 className="text-[20px] font-bold text-gray-800 mb-6">
              Customer Reviews
            </h2>

            {loadingReviews ? (
              <p className="text-gray-500 text-[14px]">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-[14px]">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <div className="scroll max-h-[600px] overflow-y-auto flex flex-col gap-6 pr-4">
                {reviews.map((item) => (
                  <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-50" key={item._id}>
                    <div className="flex items-center sm:items-start gap-4 flex-1">
                      <div className="imgWrapper shrink-0">
                        <div className="flex items-center justify-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden bg-primary/10">
                          {item.userId?.avatar ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${item.userId.avatar}`}
                              alt={item.userId.name || "profile image"}
                              width={60}
                              height={60}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[18px] font-bold text-primary">
                              {item.userId?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="info flex flex-col gap-1 flex-1">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[15px] md:text-[16px] text-gray-800 font-bold">
                            {item.userId?.name || "Unknown user"}
                          </h3>
                          <Rating
                            value={item.rating || 0}
                            readOnly
                            size="small"
                          />
                        </div>
                        <span className="text-[12px] text-gray-400 font-medium">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })
                            : ""}
                        </span>
                        <p className="text-[14px] md:text-[15px] font-normal text-gray-600 leading-relaxed mt-2">
                          {item.review}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="reviewsForm w-full lg:w-[350px] shrink-0">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
              <h2 className="text-[18px] font-bold text-gray-800 mb-4">
                Add a review
              </h2>
              <form className="flex flex-col gap-4" onSubmit={handleReviewSubmit}>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-gray-600 font-medium ml-1">Your Rating</span>
                  <Rating
                    name="simple-controlled"
                    value={ratingValue}
                    onChange={(_, newValue) => {
                      setRatingValue(newValue || 0);
                    }}
                    className="!text-yellow-500"
                  />
                </div>
                
                <TextField
                  id="reviewInput"
                  label="Share your thoughts"
                  variant="outlined"
                  multiline
                  rows={4}
                  className="w-full bg-white rounded-xl"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike?"
                  InputProps={{
                    sx: { borderRadius: '12px' }
                  }}
                />

                <Button
                  type="submit"
                  className="btn-g !h-[45px] !rounded-xl !text-[15px] !font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailsComponent;
