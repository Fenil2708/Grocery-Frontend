"use client";
import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button, CircularProgress, Rating } from "@mui/material";
import UploadBox from "@/app/admin/components/UploadBox";
import { IoMdClose } from "react-icons/io";
import { fetchDataFromApi, postData } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [categoryVal, setCategoryVal] = useState("");
  const [ratingValue, setRatingValue] = useState(1);
  const [isFeaturedVal, setisFeaturedVal] = useState(false);
  const [catData, setCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: 0,
    oldPrice: 0,
    countInStock: 0,
    discount: 0,
    sku_id: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    // Fetch ALL categories (not just this admin's) so cross-admin category selection works
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
  }, []);

  const handleChangeCategory = (event) => {
    setCategoryVal(event.target.value);
  };

  const handleChangeisFeaturedVal = (event) => {
    setisFeaturedVal(event.target.value);
  };

  const onChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setPreviewsFun = (images) => {
    // append new uploaded images to existing ones, max 6
    setPreviews((prev) => {
      const combined = [...prev, ...(images || [])];
      return combined.slice(0, 6);
    });
  };

  const removeImage = (index) => {
    const freshPreviews = previews.filter((_, i) => i !== index);
    setPreviews(freshPreviews);
  };

  const publishProduct = (e) => {
    e.preventDefault();

    if (formData.name === "") {
      context?.alertBox("error", "Please add product name");
      return;
    }
    if (formData.description === "") {
      context?.alertBox("error", "Please add product description");
      return;
    }
    if (categoryVal === "") {
      context?.alertBox("error", "Please select a category");
      return;
    }
    if (previews.length === 0) {
      context?.alertBox("error", "Please add product images");
      return;
    }

    setIsLoading(true);

    const postFields = {
      ...formData,
      category: categoryVal,
      images: previews,
      rating: ratingValue,
      isFeatured: isFeaturedVal,
    };

    postData("/api/product/create", postFields).then((res) => {
      setIsLoading(false);
      if (res.success) {
        context?.alertBox("success", "Product published successfully!");
        router.push("/admin/products-list");
      } else {
        context?.alertBox("error", res.message || "Something went wrong!");
      }
    });
  };

  return (
    <div className="px-5 py-4">
      <div className="bg-white shadow-md rounded-md p-5">
        <h2 className="text-[18px] text-gray-700 font-[600]">Add Product</h2>

        <form className="mt-5" onSubmit={publishProduct}>
          <div className="form-group mb-4 flex flex-col gap-1">
            <span className="text-[15px] text-gray-800">Product Name</span>
            <input
              type="text"
              name="name"
              onChange={onChangeInput}
              className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
            />
          </div>

          <div className="form-group mb-4 flex flex-col gap-1">
            <span className="text-[15px] text-gray-800">
              Product Description
            </span>
            <textarea
              name="description"
              onChange={onChangeInput}
              className="w-full h-[120px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 py-3 text-[14px]"
            />
          </div>

          <div className="grid grid-cols-4 gap-5">
            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">
                Product Category
              </span>
              <Select
                value={categoryVal}
                onChange={handleChangeCategory}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {catData?.length !== 0 &&
                  catData?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item._id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">Product Price</span>
              <input
                type="number"
                name="price"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">
                Product Old Price
              </span>
              <input
                type="number"
                name="oldPrice"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">Is Featured?</span>
              <Select
                value={isFeaturedVal}
                onChange={handleChangeisFeaturedVal}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">Product Stock</span>
              <input
                type="number"
                name="countInStock"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">Product Brand</span>
              <input
                type="text"
                name="brand"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">SKU ID (Optional)</span>
              <input
                type="text"
                name="sku_id"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
                placeholder="Auto-generated if empty"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">
                Product Discount
              </span>
              <input
                type="number"
                name="discount"
                onChange={onChangeInput}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
              />
            </div>

            <div className="col flex flex-col gap-1">
              <span className="text-[15px] text-gray-800">Product Rating</span>
              <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-5">
            <h2 className="text-[16px] text-gray-700 font-[600]">
              Media & Images (up to 6)
            </h2>

            <div className="flex items-center gap-4 mt-2">
              {previews?.length !== 0 &&
                previews?.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="w-[150px] h-[120px] rounded-md bg-gray-100 border border-[rgba(0,0,0,0.3)] flex items-center justify-center flex-col gap-2 relative"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="flex items-center justify-center bg-red-700 rounded-full w-6 h-6 absolute -top-[8px] -right-[8px] cursor-pointer"
                        onClick={() => removeImage(index)}
                      >
                        <IoMdClose size={20} className="text-white" />
                      </span>
                    </div>
                  );
                })}

              <UploadBox
                multiple={true}
                name="images"
                url="/api/product/uploadProductImages"
                setPreviewsFun={setPreviewsFun}
                maxImages={6}
              />
            </div>
          </div>
          <br />

          <Button type="submit" className="btn-g !px-7" disabled={isLoading}>
            {isLoading === true ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Publish & View"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
