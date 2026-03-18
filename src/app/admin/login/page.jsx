"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress, Checkbox } from "@mui/material";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "@/admin-context/ThemeProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { postData } from "@/admin-utils/api";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "@/admin-firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("adminAccessToken");
    if (token !== undefined && token !== null && token !== "") {
      router.push("/admin");
    }
    Cookies.remove("actionType");
  }, [router]);

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
    if (formFields.password === "") {
      context?.alertBox("error", "Please enter your password");
      setIsLoading(false);
      return false;
    }
    postData("/api/user/login", formFields).then((res) => {
      if (res?.error !== true) {
        if (res?.data?.role !== "ADMIN") {
          context?.alertBox("error", "You are not authorized to access this panel.");
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        context?.alertBox("success", res?.message);
        Cookies.set("adminAccessToken", res?.data?.accessToken);
        Cookies.set("adminRefreshToken", res?.data?.refreshToken);
        Cookies.set("adminUserName", res?.data?.userName);
        Cookies.set("adminUserEmail", res?.data?.userEmail);

        setFormFields({
          email: "",
          password: "",
        });

        context.setIsLogin(true);
        window.location.href = "/admin";
      } else {
        context?.alertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  const signInWithGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const fields = {
          name: user?.providerData[0]?.displayName,
          email: user?.providerData[0]?.email,
          password: null,
          avatar: user?.providerData[0]?.photoURL,
          phone: user?.providerData[0]?.phoneNumber,
          verify_Email: true,
          signUpWithGoogle: true
        }
 
          postData("/api/user/authWithGoogle", fields).then((res) => {
            if (res?.error !== true) {
              if (res?.data?.role !== "ADMIN") {
                context?.alertBox("error", "You are not authorized to access this panel.");
                setIsLoading(false);
                return;
              }

              setIsLoading(false);
              context?.alertBox("success", res?.message);
              Cookies.set("adminAccessToken", res?.data?.accessToken);
              Cookies.set("adminRefreshToken", res?.data?.refreshToken);
              Cookies.set("adminUserName", res?.data?.userName);
              Cookies.set("adminUserEmail", res?.data?.userEmail);

              setFormFields({
                email: "",
                password: "",
              });

              context.setIsLogin(true);
              window.location.href = "/admin";
            } else {
            context?.alertBox("error", res?.message);
            setIsLoading(false);
          }
        });
      }).catch((error) => {
        const errorMessage = error.message;
        context?.alertBox("error", errorMessage);
        setIsLoading(false);
      });
  }

  return (
    <section className="w-full fixed top-0 left-0 z-100 bg-white min-h-screen overflow-y-auto">
      <img
        src={"/pattern.png"}
        alt="image"
        className="w-full h-fit object-cover opacity-5 fixed top-0 left-0"
      />

      <div className="w-full fixed top-0 left-0 py-3 z-50 bg-white/80 backdrop-blur-sm md:bg-transparent">
        <div className="w-[95%] md:w-[90%] m-auto flex items-center justify-between gap-3">
          <Link href="/admin"><img src={"/logo.png"} alt="logo" className="w-[120px] md:w-[150px]" /></Link>

          <div className="flex items-center gap-2">
            <Link href={"/admin/login"}>
              <Button className="!bg-gray-100 !px-3 md:!px-5 !py-1 md:!py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !font-[500] !text-[12px] md:!text-[14px]">
                SIGN IN
              </Button>
            </Link>
            <Link href={"/admin/register"}>
              <Button className="!px-3 md:!px-5 !py-1 md:!py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !font-[500] !text-[12px] md:!text-[14px]">
                SIGN UP
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-[95%] md:w-[60%] lg:w-[40%] xl:w-[35%] m-auto h-fit pt-[100px] md:pt-[120px] pb-10">
        <h1 className="text-center text-[22px] md:text-[30px] lg:text-[40px] font-extrabold w-full m-auto leading-tight">
          Welcome Back! Sign in with your credentials.
        </h1>

        <div className="flex items-center justify-center py-3">
          <Button onClick={signInWithGoogle} disabled={isLoading} className="!bg-gray-100 !px-5 !py-2 !rounded-full !border !border-[rgba(0,0,0,0.1)] !text-gray-900 !capitalize !gap-2 !font-bold">
            Sign in with Google <FcGoogle size={20} />
          </Button>
        </div>

        <div className="w-full flex items-center justify-center gap-3 py-3">
          <span className="flex items-center w-[50px] md:w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          <span className="text-[11px] md:text-[14px] font-[500] whitespace-nowrap">
            Or, Sign in with your email
          </span>
          <span className="flex items-center w-[50px] md:w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
        </div>

        <br />
        <form className="w-[80%] md:w-[100%] m-auto" onSubmit={handleSubmit}>
          <div className="form-group mb-3 flex flex-col gap-1">
            <span className="text-[15px] text-gray-800">Email</span>
            <input
              type="text"
              name="email"
              value={formFields.email}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
            />
          </div>
          <div className="form-group mb-3 flex flex-col gap-1">
            <span className="text-[15px] text-gray-800">Password</span>
            <input
              type="password"
              name="password"
              value={formFields.password}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] outline-none rounded-sm focus:border-[rgba(0,0,0,0.4)] px-3 text-[14px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0 -ml-[10px]">
              <Checkbox {...label} defaultChecked size="small" />
              <span className="text-[15px] text-gray-800">Remember Me</span>
            </div>
            <Link
              href={"/admin/forgot-password"}
              className="text-primary font-bold text-[15px] hover:text-gray-800"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between my-3 gap-2">
            <span className="text-[14px] md:text-[15px] text-gray-800">
              Don&apos;t have an account?
            </span>
            <Link
              href={"/admin/register"}
              className="text-primary font-bold text-[14px] md:text-[15px] hover:text-gray-800"
            >
              Sign Up
            </Link>
          </div>
          <Button disabled={!validateValue || isLoading} type="submit" className="btn-g !px-7 !w-full !py-3">
            {isLoading ? <CircularProgress size={25} style={{color: '#fff'}} /> : "SIGN IN"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;

