"use client";
import UploadBox from "@/app/admin/components/UploadBox";
import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "@/admin-context/ThemeProvider";
import { useRouter } from "next/navigation";
import { deleteImages, fetchDataFromApi, postData } from "@/admin-utils/api";
import { Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Link from "next/link";

const AddSlide = () => {

  const [formFields, setFormFields] = useState({
    images: [],
    category: "",
    product: ""
  })

  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const context = useContext(MyContext);

  const router = useRouter();

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCategories(res.data);
    });
    fetchDataFromApi("/api/product").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const setPreviewsFun = (previewsArr) => {
    const imgArr = [...previews];

    for (let i = 0; i < previewsArr.length; i++) {
      imgArr.push(previewsArr[i]);
    }

    setPreviews([]);
    setTimeout(() => {
      setPreviews(imgArr);
      setFormFields((prev) => ({ ...prev, images: imgArr }));
    }, 10);
  }

  const removeImg = (img, index) => {
    deleteImages(`/api/homeSlider/deleteImage?img=${img}`).then((res) => {
      if (res.status === 200) {
        const imgArr = previews.filter((_, i) => i !== index);
        setPreviews(imgArr);
        setFormFields((prev) => ({
          ...prev,
          images: imgArr
        }));
        context?.alertBox("success", "Image Deleted Successfully");
      }
    }).catch(error => {
      console.error("Error deleting image", error);
      context?.alertBox("error", "Failed to delete image");
    })
  }

  const handleChange = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const handlePublish = (e) => {
    e.preventDefault();
    
    if (formFields.images.length === 0) {
      context?.alertBox("error", "Please upload at least one image");
      return;
    }

    setIsLoading(true);

    const postFields = {
      ...formFields,
      category: formFields.category || null,
      product: formFields.product || null
    };

    postData("/api/homeSlider/create", postFields).then((res) => {
      setIsLoading(false);
      if (res.success) {
        context?.alertBox("success", "Slide Published Successfully");
        router.push("/admin/home-slides");
      } else {
        context?.alertBox("error", res.message || "Something went wrong");
      }
    }).catch(err => {
      setIsLoading(false);
      console.error(err);
      context?.alertBox("error", "Failed to publish slide");
    })
  }

  return (
    <section className="w-full py-3 px-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] text-gray-700 font-[600]">Add Slide</h2>
        <Link href="/admin/home-slides">
          <Button className="btn-g" variant="outlined" size="small">
             View Slides
          </Button>
        </Link>
      </div>
      
      <form className="mt-5 bg-white p-5 shadow-md rounded-md" onSubmit={handlePublish}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] text-gray-700 font-[600]">
              Media & Images
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
              {
                previews?.length !== 0 && previews?.map((img, index) => {
                  return (
                    <div className="w-[150px] h-[120px] rounded-md bg-gray-100 border border-[rgba(0,0,0,0.3)] flex items-center justify-center flex-col gap-2 relative" key={index}>
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span className="flex items-center justify-center bg-red-700 rounded-full w-6 h-6 absolute -top-[8px] -right-[8px] cursor-pointer" onClick={()=>removeImg(img, index)}>
                        <IoMdClose size={20} className="text-white" />
                      </span>
                    </div>
                  )
                })
              }

              <UploadBox
                multiple={true}
                name="images"
                url="/api/homeSlider/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel id="category-label">Select Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formFields.category}
                label="Select Category"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="product-label">Select Product</InputLabel>
              <Select
                labelId="product-label"
                name="product"
                value={formFields.product}
                label="Select Product"
                onChange={handleChange}
                disabled={formFields.category !== ""}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {products?.map((prod) => (
                  <MenuItem key={prod._id} value={prod._id}>{prod.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Button 
            type="submit" 
            variant="contained" 
            className="btn-g !mt-4" 
            disabled={isLoading || formFields.images.length === 0}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Publish Slide"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddSlide;
