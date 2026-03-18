"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { MyContext } from "@/context/ThemeProvider";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
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
            router.push("/forgot-password");
            return;
          }
          Cookies.remove('actionType');
      },[context, router])
    
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
              router.push("/login");
            } else {
              context?.alertBox("error", res?.message);
              setIsLoading(false);
            }
        })
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
                <img src="/FP.png" alt="Change Password" className="w-12 h-12 object-contain -rotate-12" />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-black text-gray-800 tracking-tight leading-tight">
              New Password
            </h1>
            <p className="text-gray-400 mt-3 font-medium text-[15px]">
              Almost there! Create a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Password</label>
              <TextField
                id="newPassword"
                variant="outlined"
                className="w-full"
                type="password"
                name="newPassword"
                placeholder="••••••••"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.newPassword}
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

            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
              <TextField
                id="confirmPassword"
                variant="outlined"
                className="w-full"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.confirmPassword}
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
                {isLoading ? <CircularProgress size={24} className="!text-white" /> : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-[15px] font-black text-gray-400 hover:text-primary transition-colors"
            >
              <GoArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChangePassword