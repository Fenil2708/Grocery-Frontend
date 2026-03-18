"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@mui/material";
import OtpBox from "@/app/admin/components/OtpBox";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { postData } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  const [timeLeft, setTimeLeft] = useState(120);
  const [expired, setExpired] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const action = new URLSearchParams(window.location.search).get("action");
      if (action) {
        Cookies.set("actionType", action, { path: "/" });
      }
    }
    const storedEmail = Cookies.get("userEmail");
    if (!storedEmail) {
      context?.alertBox("error", "Please start from Forgot Password page");
      router.push("/admin/forgot-password");
    }
  }, [router, context]);

  const handleChangeOTP = (value) => { 
    setOtp(value);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setExpired(true);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const actionType = Cookies.get("actionType");
    const userEmail = Cookies.get("userEmail");

    if (!userEmail) {
      setIsLoading(false);
      context?.alertBox("error", "Email not found. Please restart Forgot Password flow.");
      router.push("/admin/forgot-password");
      return;
    }

    if (actionType === "verifyEmail") {
      postData("/api/user/verifyEmail", {
        email: userEmail,
        otp: otp,
      }).then((res) => {
        setIsLoading(false);
        if (res?.error === false) {
          context?.alertBox("success", res?.message);
          Cookies.remove("actionType");
          Cookies.remove("userEmail");
          router.push("/admin/login");
        } else {
          context?.alertBox("error", res?.message);
        }
      });
      return;
    }

    if (actionType === "forgot-password") {
      postData("/api/user/verify-forgot-password-otp", {
        email: userEmail,
        otp: otp,
      }).then((res) => {
        setIsLoading(false);
        if (res?.error === false) {
          context?.alertBox("success", res?.message);
          Cookies.set("forgotPasswordVerified", "true", { path: "/" });
          router.push("/admin/forgot-password/change-password");
        } else {
          context?.alertBox("error", res?.message);
        }
      });
      return;
    }

    setIsLoading(false);
    context?.alertBox("error", "Invalid action. Please start over.");
    router.push("/admin/forgot-password");
  };


  const resendOTP=()=>{
    postData("/api/user/resend-otp", {
      email:Cookies.get("userEmail")
    }).then((res)=>{
      if (res?.error === false){
        context?.alertBox("success", res?.message);
        setTimeLeft(120);
        setExpired(false);
        setOtp("");
      } else {
        context?.alertBox("error", res?.message);
      }
    })
  }

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
              <Button className="!px-5 !py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !font-[500]">
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
       <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg border border-[rgba(0,0,0,0.1)] w-[100%] m-auto">
          <div className="text-center">
            <img src="/verify.png" alt="image" className="m-auto w-[80px]" />
            <h1 className="text-center text-[20px] font-[500] text-gray-800 mt-3">
              Verify OTP
            </h1>
            <span className="text-[16px]">
              OTP send to{" "}
              <span className="text-primary font-bold">
                {Cookies.get("userEmail") || "your email address"}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-center my-6">
            <OtpBox length={6} onChange={handleChangeOTP} />
          </div>
          
          <div className="flex mb-4">
            {expired ? (
              <span className="text-primary font-bold text-[15px] ml-auto cursor-pointer" onClick={resendOTP}>
                Resend Otp
              </span>
            ) : (
              <>
                <b className="ml-auto">
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </b>
              </>
            )}
          </div>

          <div className="mt-4 w-full relative">
            <Button disabled={isLoading || otp?.length < 6} type="submit" className="w-full btn-g !py-4 !text-[16px]">
              {isLoading ? <CircularProgress size={25} style={{color: '#fff'}} /> : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Verify;
