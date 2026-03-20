"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import OtpBox from "@/components/OtpBox";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import { MyContext } from "@/context/ThemeProvider";

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
      router.push("/forgot-password");
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
      router.push("/forgot-password");
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
          router.push("/login");
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

          router.push("/forgot-password/change-password");

        } else {
          context?.alertBox("error", res?.message);
        }
      });
      return;
    }

    setIsLoading(false);
    context?.alertBox("error", "Invalid action. Please start over.");
    router.push("/forgot-password");
  };


  const resendOTP=()=>{
    postData("/api/user/resend-otp", {
      email:Cookies.get("userEmail")
    }).then((res)=>{
      if (res?.error === false){
        context.alertBox("success", res?.message);
        setTimeLeft(120);
        setExpired(false);
        setOtp("");
      } else {
        context.alertBox("error", res?.message);
      }
    })
  }

  return (
    <section className="w-full min-h-[90vh] bg-gray-50 flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[500px] m-auto"
        >
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                <Image src="/verify.png" alt="Verify Account" width={48} height={48} className="w-12 h-12 object-contain rotate-12" />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-black text-gray-800 tracking-tight leading-tight">
              OTP Verification
            </h1>
            <p className="text-gray-400 mt-4 font-medium text-[15px] leading-relaxed">
              We&apos;ve sent a verification code to<br/>
              <span className="text-primary font-black bg-primary/5 px-2 py-0.5 rounded-lg mt-1 inline-block">
                {Cookies.get("userEmail")}
              </span>
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <label className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Enter 6-Digit Code</label>
              <div className="premium-otp-container">
                <OtpBox length={6} onChange={handleChangeOTP} />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${expired ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                 <span className="text-[13px] font-bold text-gray-400">{expired ? 'Code Expired' : 'Secure Session'}</span>
              </div>
              
              <div className="timer-box">
                {expired ? (
                  <Button 
                    variant="text"
                    className="!text-primary !font-black !text-[14px] !capitalize !p-0 !min-w-0 hover:!bg-transparent active:scale-95" 
                    onClick={resendOTP}
                  >
                    Resend New Code
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <span className="text-[14px] font-black text-gray-800 tabular-nums">
                        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full !bg-primary !text-white !font-black !py-4 !rounded-[20px] !text-[16px] shadow-xl shadow-primary/20 hover:!bg-secondary transition-all active:scale-[0.98] disabled:!bg-gray-100 !h-[64px]"
                disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? <CircularProgress size={24} className="!text-white" /> : "Verify & Continue"}
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-[15px] font-black text-gray-400 hover:text-primary transition-colors"
            >
              <GoArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Secure Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Verify;