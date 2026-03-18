"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
import Link from "next/link";
import { MyContext } from "@/admin-context/ThemeProvider";
import Cookies from "js-cookie";
import { postData } from "@/admin-utils/api";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    
      const [formFields, setFormFields] = useState({
        email:Cookies.get('userEmail'),
        newPassword: "",
        confirmPassword: "",
      });
    
      const context = useContext(MyContext);
    
      const router = useRouter();

      useEffect(() => {
          const email = Cookies.get('userEmail');
          const forgotVerified = Cookies.get('forgotPasswordVerified');
          if (!email || forgotVerified !== 'true') {
            context?.alertBox("error", "Please complete OTP verification first.");
            router.push("/admin/forgot-password");
            return;
          }
          Cookies.remove('actionType');
      },[])
    
      const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
          return {
            ...formFields,
            [name]: value, 
          };
        });
      };
    
      const validateValue = Object.values(formFields).every((el) => el);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        if (formFields.newPassword === "") {
          context?.alertBox("error", "Please enter your new password");
          setIsLoading(false);
          return false;
        }
        if (formFields.confirmPassword === "") {
          context?.alertBox("error", "Please enter your confirm password");
          setIsLoading(false);
          return false;
        }

        postData("/api/user/forgot-password/change-password", formFields).then((res)=>{
            if (res?.error === false) {
              setIsLoading(false);
              Cookies.remove('userEmail');
              Cookies.remove('forgotPasswordVerified');
              router.push("/admin/login");
            } else {
              context?.alertBox("error", res?.message);
              setIsLoading(false);
            }
        })
      };
  return (
   <section className="w-full fixed top-0 left-0 z-100 bg-white min-h-screen overflow-y-auto">
      <img
        src={"/pattern.png"}
        alt="image"
        className="w-full h-fit object-cover opacity-5 fixed top-0 left-0"
      />

      <div className="w-full fixed top-0 left-0 py-3 z-50">
        <div className="w-[90%] m-auto flex items-center justify-between">
          <img src={"/logo.png"} alt="logo" />

          <div className="flex items-center gap-3">
            <Link href={"/admin/login"}>
              <Button className="!bg-gray-100 !px-5 !py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !font-[500]">
                SIGN IN
              </Button>
            </Link>
            <Link href={"/admin/register"}>
              <Button className="!px-5 !py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !font-[500]">
                SIGN UP
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-[60%] lg:w-[40%] xl:w-[35%] m-auto h-fit pt-[120px] pb-10">
       <div className="bg-white p-10 rounded-lg border border-[rgba(0,0,0,0.1)] w-[100%] m-auto">
          <div className="text-center">
            <img src="/FP.png" alt="image" className="m-auto" />
            <h1 className="text-center text-[20px] font-[500] text-gray-800 mb-6 mt-5">
              Change Password
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="my-4 w-full">
              <TextField
                id="newPassword"
                label="New Password"
                variant="outlined"
                className="w-full"
                type="password"
                name="newPassword"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.newPassword}
              />
            </div>

            <div className="my-4 w-full">
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
                type="password"
                name="confirmPassword"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.confirmPassword}
              />
            </div>

            <div className="my-4 w-full relative">
              <Button disabled={!validateValue || isLoading} type="submit" className="w-full btn-g !py-4 !text-[16px]">
                {isLoading ? <CircularProgress size={25} style={{color: '#fff'}} /> : 'Submit'}
              </Button>
            </div>
          </form>

        </div>
      </div>
    </section>
  )
}

export default ChangePassword;
