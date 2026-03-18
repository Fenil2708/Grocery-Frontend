"use client";
import { MyContext } from "@/admin-context/ThemeProvider";
import { uploadImage } from "@/admin-utils/api";
import React, { useContext, useState } from "react";
import { FaRegImage } from "react-icons/fa";
import { CircularProgress } from "@mui/material";

const UploadBox = (props) => {
  const [uploading, setUploading] = useState(false);

  const context = useContext(MyContext);

  const onChangeFile = async (el, url) => {
    try {
      const files = el.target.files;
      if (!files || files.length === 0) return;

      const maxImages = props?.maxImages || 6;
      if (files.length > maxImages) {
        context?.alertBox(
          "error",
          `You can upload maximum ${maxImages} images at a time.`
        );
        return;
      }

      const formdata = new FormData();
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file &&
          (file.type === "image/jpeg" ||
            file.type === "image/jpg" ||
            file.type === "image/png" ||
            file.type === "image/webp" ||
            file.type === "image/svg+xml")
        ) {
          formdata.append(props?.name, file);
        } else {
          context?.alertBox(
            "error",
            "Please select a valid JPG, PNG, WEBP, or SVG image file."
          );
          setUploading(false);
          return;
        }
      }

      uploadImage(url, formdata).then((res) => {
        setUploading(false);
        // axios response structure is res.data
        const data = res?.data || res;
        if (data?.success) {
          props.setPreviewsFun(data?.images || []);
        } else {
          context?.alertBox("error", data?.message || "Upload failed");
        }
      }).catch(err => {
        setUploading(false);
        console.error("Upload error:", err);
        const errorMsg = err?.response?.data?.message || err?.message || "An error occurred during upload";
        context?.alertBox("error", errorMsg);
      });
    } catch (error) {
      console.log(error);
      setUploading(false);
      context?.alertBox("error", error.message);
    }
  };

  return (
    <div className="w-[150px] h-[120px] rounded-md bg-gray-100 p-5 border border-dashed border-[rgba(0,0,0,0.3)] flex items-center justify-center flex-col gap-2 relative uploadBox">
      {uploading === true ? (
        <div className="flex flex-col justify-center items-center">
          <CircularProgress />
          <span>Uploading...</span>
        </div>
      ) : (
        <>
          <FaRegImage size={40} className="text-gray-400" />
          <span className="text-gray-600 text-[13px]">Image Upload</span>

          <input
            type="file"
            accept="image/*"
            className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
            name={props?.name}
            onChange={(e) => {
              onChangeFile(e, props?.url);
            }}
            multiple={props?.multiple !== undefined ? props?.multiple : false}
          />
        </>
      )}
    </div>
  );
};

export default UploadBox;