"use client";
import UploadBox from "@/app/admin/components/UploadBox";
import React, { useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "@/admin-context/ThemeProvider";
import { useRouter } from "next/navigation";
import { deleteImages, postData } from "@/admin-utils/api";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";

const AddCategory = () => {
    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
        color: ""
    })

    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const router = useRouter();

    const inputHandler = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

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
        deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
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
            console.error(error);
            context?.alertBox("error", "Failed to delete image");
        })
    }

    const handlePublish = (e) => {
        e.preventDefault();

        if (formFields.name === "" || formFields.images.length === 0 || formFields.color === "") {
            context?.alertBox("error", "Please fill all the fields");
            return;
        }

        setIsLoading(true);

        postData("/api/category/create", formFields).then((res) => {
            setIsLoading(false);
            if (res.success) {
                context?.alertBox("success", "Category Published Successfully");
                router.push("/admin/category-list");
            } else {
                context?.alertBox("error", res.message || "Something went wrong");
            }
        }).catch(err => {
            setIsLoading(false);
            console.error(err);
            context?.alertBox("error", "Failed to publish category");
        })
    }

    return (
        <section className="w-full py-3 px-5">
            <div className="flex items-center justify-between">
                <h2 className="text-[18px] text-gray-700 font-[600]">Add Category</h2>
                <Link href="/admin/category-list">
                    <Button className="btn-g" variant="outlined" size="small">
                        View List
                    </Button>
                </Link>
            </div>

            <form className="mt-5 bg-white p-5 shadow-md rounded-md" onSubmit={handlePublish}>
                <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="form-group flex flex-col gap-1">
                        <span className="text-[15px] text-gray-800 font-[500]">Category Name</span>
                        <input
                            type="text"
                            name="name"
                            value={formFields.name}
                            onChange={inputHandler}
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
                        />
                    </div>

                    <div className="form-group flex flex-col gap-1">
                        <span className="text-[15px] text-gray-800 font-[500]">Category Color</span>
                        <input
                            type="text"
                            name="color"
                            value={formFields.color}
                            onChange={inputHandler}
                            placeholder="#ffffff"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
                        />
                    </div>
                </div>

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
                                        <span className="flex items-center justify-center bg-red-700 rounded-full w-6 h-6 absolute -top-[8px] -right-[8px] cursor-pointer" onClick={() => removeImg(img, index)}>
                                            <IoMdClose size={20} className="text-white" />
                                        </span>
                                    </div>
                                )
                            })
                        }

                        <UploadBox
                            multiple={true}
                            name="images"
                            url="/api/category/uploadCategoryImage"
                            setPreviewsFun={setPreviewsFun}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        className="btn-g !mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Publish Category"}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddCategory;
