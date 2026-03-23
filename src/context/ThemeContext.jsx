"use client";
import { useEffect, useState } from "react";
import { MyContext } from "./ThemeProvider";

import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { fetchDataFromApi, postData, deleteData, putData } from "@/utils/api";


import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { NotificationProvider } from "./NotificationContext";

const ThemeProvider = ({ children }) => {
  const [isOpenAddressBox, setIsOpenAddressBox] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({
    email: "",
    name: "",
    _id: ""
  });
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [addressList, setAddressList] = useState([]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token !== undefined && token !== null && token !== "") {
      Cookies.remove("actionType")
      setIsLogin(true)
      getUserData();
      getCartData();
      getMyListData();
      getAddressList();
      // router.push("/"); // Don't redirect automatically on refresh unless needed
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


  const getCartData = async () => {
    try {
      const response = await fetchDataFromApi("/api/cart");
      if (response?.success) {
        setCartData(response.data || []);
      }
    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };

  const getMyListData = async () => {
    try {
      const response = await fetchDataFromApi("/api/my-list");
      if (response?.success) {
        setMyListData(response.data || []);
      }
    } catch (error) {
      console.log("Error fetching my list", error);
    }
  };

  const getAddressList = async () => {
    try {
      const response = await fetchDataFromApi("/api/address");
      if (response?.success) {
        setAddressList(response.data || []);
      }
    } catch (error) {
      console.log("Error fetching addresses", error);
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

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await postData("/api/cart/add", { productId, quantity });
      if (response?.success) {
        getCartData();
      }
      return response;
    } catch (error) {
      console.log("Error adding to cart", error);
      return { success: false, message: "Error adding to cart" };
    }
  };

  const updateCartQty = async (productId, quantity) => {
    try {
      const response = await putData(`/api/cart/update/${productId}`, { quantity });
      if (response?.success) {
        getCartData();
      }
      return response;
    } catch (error) {
      console.log("Error updating cart", error);
      return { success: false, message: "Error updating cart" };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await deleteData(`/api/cart/remove/${productId}`);
      if (response?.success) {
        getCartData();
      }
      return response;
    } catch (error) {
      console.log("Error removing from cart", error);
      return { success: false, message: "Error removing from cart" };
    }
  };

  const addToMyList = async (productId) => {
    try {
      const response = await postData("/api/my-list/add", { productId });
      if (response?.success) {
        getMyListData();
      }
      return response;
    } catch (error) {
      console.log("Error adding to my list", error);
      return { success: false, message: "Error adding to my list" };
    }
  };

  const deleteFromMyList = async (productId) => {
    try {
      const response = await deleteData(`/api/my-list/remove/${productId}`);
      if (response?.success) {
        getMyListData();
      }
      return response;
    } catch (error) {
      console.log("Error deleting from my list", error);
      return { success: false, message: "Error deleting from my list" };
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
    user,
    cartData,
    setCartData,
    getCartData,
    myListData,
    setMyListData,
    getAddressList,
    addressList,
    setAddressList,
    postData,
    fetchDataFromApi,
    deleteData,
    putData,
    addToCart,
    updateCartQty,
    removeFromCart,
    addToMyList,
    deleteFromMyList
  };

  return (
    <MyContext.Provider value={values}>
      <NotificationProvider userId={user?._id}>
        <AuthGuard>
          {!pathname.startsWith("/admin") && <Header />}
          {children}
          {!pathname.startsWith("/admin") && <Footer />}
        </AuthGuard>
      </NotificationProvider>
      <Toaster />
    </MyContext.Provider>
  );
};

export default ThemeProvider; 
