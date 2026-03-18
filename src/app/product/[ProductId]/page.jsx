"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductDetailsComponent from "@/components/ProductDetails";
import ProductRow from "@/components/ProductRow";
import { fetchDataFromApi, postData } from "@/utils/api";

const ProductDetails = () => {
  const { ProductId } = useParams();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const loadProduct = async (id) => {
    try {
      setLoadingProduct(true);
      const res = await fetchDataFromApi(`/api/product/${id}`);
      setProduct(res?.data || null);
    } catch (error) {
      console.error("Error loading product", error);
      setProduct(null);
    } finally {
      setLoadingProduct(false);
    }
  };

  const loadReviews = async (id) => {
    try {
      setLoadingReviews(true);
      const res = await fetchDataFromApi(`/api/review/${id}`);
      setReviews(res?.data || []);
      setAvgRating(res?.avgRating || 0);
      setTotalReviews(res?.totalReviews || 0);
    } catch (error) {
      console.error("Error loading reviews", error);
      setReviews([]);
      setAvgRating(0);
      setTotalReviews(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!ProductId) return;
    loadProduct(ProductId);
    loadReviews(ProductId);
  }, [ProductId]);

  const handleAddReview = async ({ review, rating }) => {
    if (!ProductId) {
      return { success: false, message: "Product not found" };
    }

    try {
      const res = await postData("/api/review", {
        productId: ProductId,
        review,
        rating,
      });

      if (res?.success) {
        // Refresh reviews so average and list stay in sync
        await loadReviews(ProductId);
      }

      return res;
    } catch (error) {
      console.error("Error adding review", error);
      return {
        success: false,
        message: "Error adding review",
      };
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container pb-5">
        <ProductDetailsComponent
          product={product}
          loadingProduct={loadingProduct}
          reviews={reviews}
          avgRating={avgRating}
          totalReviews={totalReviews}
          loadingReviews={loadingReviews}
          onSubmitReview={handleAddReview}
        />
      </div>
      <ProductRow title="Related Products" />
    </section>
  );
};

export default ProductDetails;