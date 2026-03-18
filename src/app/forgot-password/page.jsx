"use client";
import React, { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { MyContext } from "@/context/ThemeProvider";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "",
  });

  const context = useContext(MyContext);

  const router = useRouter();

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

    if (formFields.email === "") {
      context?.alertBox("error", "Please enter your email address");
      setIsLoading(false);
      return false;
    }
    Cookies.set('actionType','forgot-password', { path: '/' });
    Cookies.set('userEmail', formFields.email, { path: '/' });

    postData("/api/user/forgot-password", formFields).then((res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          router.push("/verify?action=forgot-password");
        } else {
          context?.alertBox("error", res?.message);
          setIsLoading(false);
        }
    });
  };

  return (
    <section className="w-full min-h-[90vh] bg-gray-50 flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[500px] m-auto">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <img src="/FP.png" alt="Forgot Password" className="w-12 h-12 object-contain -rotate-12" />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-black text-gray-800 tracking-tight leading-tight">
              Forgot Password?
            </h1>
            <p className="text-gray-400 mt-3 font-medium text-[15px]">
              Don&apos;t worry! It happens. Enter your email and we&apos;ll send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <TextField
                id="emailField"
                variant="outlined"
                className="w-full"
                type="email"
                name="email"
                placeholder="yourname@example.com"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.email}
                InputProps={{
                  sx: {
                    borderRadius: '18px',
                    backgroundColor: '#f9fafb',
                    '& fieldset': { border: 'none' },
                    height: '60px',
                    fontSize: '15px',
                    fontWeight: '600'
                  }
                }}
              />
            </div>

            <Button 
                type="submit" 
                className="w-full !bg-primary !text-white !font-black !py-4 !rounded-[20px] !text-[16px] shadow-xl shadow-primary/20 hover:!bg-secondary transition-all active:scale-[0.98] disabled:!bg-gray-100 !h-[60px]" 
                disabled={!validateValue || isLoading}
            >
                {isLoading ? <CircularProgress size={24} className="!text-white" /> : 'Send Reset OTP'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-[15px] font-black text-gray-400 hover:text-primary transition-colors"
            >
              <GoArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Secure Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
