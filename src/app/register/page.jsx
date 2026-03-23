"use client";
import React, { useContext, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "@/context/ThemeProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "@/firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
 
const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
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

  const validateValue = Object.values(formFields).every(el => el)

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context?.alertBox("error", "Please enter your full name");
      setIsLoading(false);
      return false;
    }

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

    postData("/api/user/register", formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context?.alertBox("success", res?.message);
        Cookies.set("userEmail", formFields.email);
        Cookies.set("actionType", 'verifyEmail');

        setFormFields({
          name: "",
          email: "",
          password: "",
        });

        router.push("/verify");
      } else {
        context?.alertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  const signInWithGoogle = () => {
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
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
              setIsLoading(false);
              context?.alertBox("success", res?.message);
              Cookies.set("accessToken", res?.data?.accessToken);
              Cookies.set("refreshToken", res?.data?.refreshToken);
              Cookies.set("userName", res?.data?.userName);
              Cookies.set("userEmail", res?.data?.userEmail);
  
              setFormFields({
                email: "",
                password: "",
              });
  
              context.setIsLogin(true);
              router.push("/");
            } else {
              context?.alertBox("error", res?.message);
              setIsLoading(false);
            }
          });
  
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          context?.alertBox("error", errorMessage);
          // ...
        });
    }
  return (
    <section className="min-h-[90vh] w-full bg-[#fdfdfd] flex items-center justify-center relative overflow-hidden py-12 md:py-20">
      <div className="container relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 w-full max-w-[480px] m-auto group transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-12 transition-transform duration-500">
                  <span className="text-2xl text-primary font-black">R</span>
              </div>
              <h1 className="text-[28px] md:text-[32px] font-black text-gray-800 tracking-tight">
                Create Account
              </h1>
              <p className="text-gray-400 text-[14px] mt-2 font-medium">Join us and start shopping today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <TextField
                id="fullName"
                label="Full Name"
                variant="outlined"
                className="w-full"
                name="name"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.name}
                InputLabelProps={{
                    sx: { '&.Mui-focused': { color: '#02B290' } }
                }}
                InputProps={{
                    sx: { borderRadius: '14px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }
                }}
              />
            </div>
            <div className="space-y-1">
              <TextField
                id="emailField"
                label="Email Address"
                variant="outlined"
                className="w-full"
                type="email"
                name="email"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.email}
                InputLabelProps={{
                    sx: { '&.Mui-focused': { color: '#02B290' } }
                }}
                InputProps={{
                    sx: { borderRadius: '14px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }
                }}
              />
            </div>
            <div className="space-y-1 relative">
              <TextField
                id="passwordField"
                label="Password"
                variant="outlined"
                className="w-full"
                type={`${isShowPassword ? "text" : "password"}`}
                name="password"
                onChange={onChangeInput}
                disabled={isLoading}
                value={formFields.password}
                InputLabelProps={{
                    sx: { '&.Mui-focused': { color: '#02B290' } }
                }}
                InputProps={{
                    sx: { borderRadius: '14px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }
                }}
              />

              <IconButton
                aria-label="password"
                size="medium"
                className="!absolute top-[10px] right-[10px] z-50 !text-gray-300 hover:!text-primary transition-colors"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </IconButton>
            </div>

            <Button 
                type="submit" 
                className="w-full !bg-primary !text-white !py-4 !rounded-2xl !text-[16px] !font-black !capitalize shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                disabled={!validateValue || isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </form>

          <div className="relative my-10 text-center">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
              </div>
              <span className="relative px-4 bg-white text-[12px] font-black text-gray-300 uppercase tracking-widest">Or sign up with</span>
          </div>

          <Button
            startIcon={<FcGoogle size={20} />}
            variant="outlined"
            size="large"
            onClick={signInWithGoogle}
            className="w-full !bg-gray-50 !text-gray-700 !font-bold !py-4 !rounded-2xl !border-transparent hover:!bg-gray-100 !capitalize transition-all"
          >
            Google
          </Button>

          <div className="text-center mt-10 text-[14px] font-medium text-gray-400">
            <span>
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-primary hover:text-secondary font-black"
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
    </section>
  );
};

export default Register;
