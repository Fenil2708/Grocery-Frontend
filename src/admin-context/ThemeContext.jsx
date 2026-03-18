"use client";
import { useEffect, useState } from "react";
import { MyContext } from "./ThemeProvider";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/admin-utils/api";


import { NotificationProvider } from "./NotificationContext";

const ThemeProvider = ({ children }) => {
  const [isOpenAddressBox, setIsOpenAddressBox] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({
    email: "",
    name: "",
    avatar: "",
    _id: ""
  });

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("adminAccessToken");
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true)
      getUserData();
    }
  }, [isLogin]);

  const getUserData = async () => {
    try {
      const response = await fetchDataFromApi("/api/user/user-details");
      if (response?.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.log("Error fetching user data", error);
    }
  };

  const isOpenAddressPanel = () => {
    setIsOpenAddressBox(!isOpenAddressBox);
  };

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  const values = {
    setIsOpenAddressBox,
    isOpenAddressBox,
    isOpenAddressPanel,
    alertBox,
    setIsLogin,
    isLogin,
    setUser,
    user
  };

  return (
    <MyContext.Provider value={values}>
      <NotificationProvider userId={user?._id}>
        {children}
      </NotificationProvider>
      <Toaster />
    </MyContext.Provider>
  );
};

export default ThemeProvider; 
