"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Radio } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import { MyContext } from "@/context/ThemeProvider";
import { fetchDataFromApi, postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { MdOutlineLocationOn } from "react-icons/md";

const Checkout = () => {
  const context = useContext(MyContext);
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    if (context.cartData?.length > 0) {
      const total = context.cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotalPrice(total);
    }
  }, [context.cartData]);


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      context.alertBox("error", "Please select a delivery address");
      return;
    }

    if (!context.cartData || context.cartData.length === 0) {
      context.alertBox("error", "Your cart is empty");
      return;
    }

    if (paymentMethod === "razorpay") {
      const res = await loadRazorpay();
      if (!res) {
        context.alertBox("error", "Razorpay SDK failed to load. Check your internet.");
        return;
      }

      try {
        // 1. Create Order on Backend (Razorpay Order)
        const orderResponse = await postData("/api/payment/create-order", {
          amount: totalPrice,
          currency: "USD"
        });

        if (!orderResponse.success) {
          context.alertBox("error", "Order creation failed on server");
          return;
        }

        const { id: razor_order_id, amount, currency } = orderResponse.data;

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          console.error("Razorpay Key ID is missing in frontend .env");
          context.alertBox("error", "Payment configuration error. Please contact support.");
          return;
        }

        // 2. Open Razorpay Modal
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "Grocery App",
          description: "Payment for your order",
          order_id: razor_order_id,
          handler: async function (response) {
            // 3. Verify Payment on Backend
            const verifyRes = await postData("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              // 4. Create Order in Database
              await finalOrderCreate(response.razorpay_payment_id, "Paid");
            } else {
              context.alertBox("error", "Payment verification failed");
            }
          },
          prefill: {
            name: (context.user?.name && context.user.name !== "undefined" && context.user.name !== "null" && context.user.name.trim() !== "") ? context.user.name : "Customer",
            email: (context.user?.email && context.user.email !== "undefined" && context.user.email !== "null" && context.user.email.trim() !== "") ? context.user.email : "customer@example.com",
            contact: context.addressList.find(a => a._id === selectedAddress)?.mobile || "9999999999",
          },
          theme: {
            color: "#02B290",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (error) {
        console.error(error);
        context.alertBox("error", "Something went wrong with Razorpay");
      }
    } else {
      // COD Flow
      await finalOrderCreate("COD_" + Date.now(), "Pending");
    }
  };

  const finalOrderCreate = async (payId, payStatus) => {
    const orderData = {
      delivery_address: selectedAddress,
      totalAmt: totalPrice,
      products: context.cartData.map(item => ({
        productId: item.productId._id,
        productTitle: item.productId.name,
        quantity: item.quantity,
        price: item.price,
        image: item.productId.images?.[0] || "",
        subTotal: item.subTotal
      })),
      paymentId: payId,
      payment_status: payStatus
    };

    try {
      const res = await postData("/api/order/create", orderData);
      if (res.success) {
        context.alertBox("success", "Order placed successfully!");
        context.setCartData([]); 
        router.push("/my-orders");
      } else {
        context.alertBox("error", res.message || "Failed to place order");
      }
    } catch (error) {
      console.log(error);
      context.alertBox("error", "Error creating database order");
    }
  };

  return (
    <section className="bg-[#fcfdfe] py-12 md:py-20 min-h-[90vh]">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="flex-1 min-w-0 space-y-12">
            <div>
                <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 tracking-tight leading-none mb-4">
                    Checkout
                </h1>
                <p className="text-gray-400 font-bold text-[15px] flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary/20"></span>
                    Complete your order and get fresh groceries delivered
                </p>
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 md:p-10 border-b border-gray-50 bg-white group-hover:bg-gray-50/30 transition-colors">
                <div>
                    <h2 className="text-[22px] md:text-[24px] font-black text-gray-800 leading-none">
                    Delivery Address
                    </h2>
                    <p className="text-[13px] text-gray-300 mt-2 font-black uppercase tracking-[0.15em]">Where should we ship?</p>
                </div>
                <Button
                  className="!bg-primary/5 !text-primary !rounded-2xl !capitalize !font-black !px-8 !py-4 !text-[14px] hover:!bg-primary hover:!text-white transition-all shadow-sm active:scale-95"
                  onClick={() => context.setIsOpenAddressBox(true)}
                >
                  <FiPlus size={20} className="mr-2" /> Add New
                </Button>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {context.addressList && context.addressList.length > 0 ? (
                    context.addressList.map((addr, index) => (
                        <label 
                            key={index} 
                            className={`relative group cursor-pointer transition-all duration-500 scale-100 active:scale-[0.98] ${
                                selectedAddress === addr._id 
                                ? '' 
                                : 'hover:translate-y-[-4px]'
                            }`}
                        >
                            <input 
                                type="radio"
                                className="sr-only"
                                checked={selectedAddress === addr._id}
                                onChange={() => setSelectedAddress(addr._id)}
                            />
                            <div className={`h-full p-8 rounded-[28px] border-2 transition-all duration-500 relative overflow-hidden ${
                                selectedAddress === addr._id 
                                ? 'bg-white border-primary shadow-[0_20px_40px_rgba(2,178,144,0.12)]' 
                                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]'
                            }`}>
                                {selectedAddress === addr._id && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                )}
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                                        selectedAddress === addr._id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                        {addr.addressType}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${selectedAddress === addr._id ? 'border-primary bg-primary' : 'border-gray-100 bg-white'}`}>
                                        <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-500 ${selectedAddress === addr._id ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <p className="text-gray-900 font-black text-[17px] tracking-tight">{addr.mobile}</p>
                                    <p className="text-gray-500 text-[15px] font-bold leading-relaxed pr-4">
                                        {addr.address_line1}, {addr.city}
                                    </p>
                                    <p className="text-gray-400 text-[13px] font-black uppercase tracking-wider">
                                        {addr.state} • {addr.pincode}
                                    </p>
                                </div>
                            </div>
                        </label>
                    ))
                    ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100 group/empty">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover/empty:scale-110 transition-transform">
                            <MdOutlineLocationOn size={32} className="text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold italic">No addresses saved yet.</p>
                    </div>
                    )}
                </div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden group">
                <div className="p-8 md:p-10 border-b border-gray-50 bg-white group-hover:bg-gray-50/30 transition-colors">
                    <h2 className="text-[22px] md:text-[24px] font-black text-gray-800 leading-none">
                        Payment Method
                    </h2>
                    <p className="text-[13px] text-gray-300 mt-2 font-black uppercase tracking-[0.15em]">Select Secure Payment Option</p>
                </div>
                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className={`relative flex items-center gap-6 p-8 rounded-[28px] border-2 cursor-pointer transition-all duration-500 active:scale-[0.98] ${
                          paymentMethod === "razorpay" 
                          ? "border-primary bg-white shadow-[0_20px_40px_rgba(43,190,249,0.1)]" 
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                      }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${paymentMethod === "razorpay" ? 'border-primary bg-primary' : 'border-gray-100 bg-white'}`}>
                            <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-500 ${paymentMethod === "razorpay" ? 'scale-100' : 'scale-0'}`}></div>
                          </div>
                          <input type="radio" className="sr-only" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                          <div className="flex-1">
                            <p className="text-gray-900 font-black text-[17px] tracking-tight">Online Payment</p>
                            <p className="text-gray-400 text-[13px] font-bold mt-1">Cards, UPI, Netbanking (Secure)</p>
                          </div>
                          <div className="p-3 bg-primary/5 rounded-xl">
                             <Image src="https://razorpay.com/favicon.png" width={24} height={24} className="w-6 h-6 grayscale" alt="razorpay" />
                          </div>
                      </label>
                      <label className={`relative flex items-center gap-6 p-8 rounded-[28px] border-2 cursor-pointer transition-all duration-500 active:scale-[0.98] ${
                          paymentMethod === "cod" 
                          ? "border-primary bg-white shadow-[0_20px_40px_rgba(43,190,249,0.1)]" 
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                      }`}>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${paymentMethod === "cod" ? 'border-primary bg-primary' : 'border-gray-100 bg-white'}`}>
                            <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-500 ${paymentMethod === "cod" ? 'scale-100' : 'scale-0'}`}></div>
                          </div>
                          <input type="radio" className="sr-only" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                          <div className="flex-1">
                            <p className="text-gray-900 font-black text-[17px] tracking-tight">Cash on Delivery</p>
                            <p className="text-gray-400 text-[13px] font-bold mt-1">Pay at your doorstep</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl text-primary">
                             <span className="text-xl">🚚</span>
                          </div>
                      </label>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-white/50 sticky top-28 overflow-hidden transition-all duration-500 hover:shadow-[0_40px_120px_rgba(0,0,0,0.1)]">
              <div className="p-8 md:p-10 border-b border-gray-100/50 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h2 className="text-[20px] md:text-[22px] text-gray-900 font-black flex items-center gap-3 relative z-10">
                   Order Summary 
                   <span className="bg-primary/10 text-primary text-[11px] px-3 py-1 rounded-full font-black uppercase tracking-widest leading-none">{context.cartData?.length} Items</span>
                </h2>
              </div>

              <div className="p-4 md:p-6 max-h-[40vh] overflow-y-auto custom-scrollbar-premium">
                <div className="space-y-5 px-4">
                    {context.cartData?.map((item, index) => (
                        <div key={index} className="flex items-center gap-5 group py-2">
                            <div className="w-16 h-16 bg-white rounded-2xl p-2 shrink-0 shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex items-center justify-center">
                                <Image
                                    src={item.productId.images?.[0] || "/product1.png"}
                                    alt={item.productId.name}
                                    width={64}
                                    height={64}
                                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col gap-1">
                                <h4 className="text-[14px] font-black text-gray-800 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                                    {item.productId.name}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                                        Qty: {item.quantity}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        ${item.price?.toFixed(2)} / ea
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[15px] font-black text-gray-900 whitespace-nowrap">
                                    ${item.subTotal?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              
              <div className="p-8 md:p-10 bg-white/40 border-t border-gray-100/50">
                   <div className="space-y-4">
                        <div className="flex items-center justify-between text-[15px]">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-[11px]">Subtotal</span>
                            <span className="font-black text-gray-800 tracking-tight">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[15px]">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-[11px]">Shipping</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-gray-300 font-bold line-through">$10.00</span>
                                <span className="text-green-500 font-black uppercase tracking-widest text-[11px]">FREE</span>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-200/50 mt-4 relative">
                             <div className="flex items-center justify-between relative z-10">
                                <span className="text-[18px] font-black text-gray-900 uppercase tracking-tight">Total Payment</span>
                                <span className="text-[32px] font-black text-primary leading-none tracking-tight">${totalPrice.toFixed(2)}</span>
                             </div>
                             <div className="flex items-center gap-2 justify-end mt-2 text-gray-400 italic font-bold text-[11px]">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04Customizable0a2.238 2.238 0 002.147 2.147h11.07a2.238 2.238 0 002.147-2.147V6.928z"/></svg>
                                Including all taxes
                             </div>
                        </div>
                   </div>

                   <div className="mt-10">
                     <Button 
                        className="!w-full !bg-primary !text-white !font-black !rounded-[24px] !text-[17px] !capitalize shadow-[0_20px_40px_rgba(2,178,144,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 !h-[64px]" 
                        onClick={handleCheckout}
                     >
                        {paymentMethod === "razorpay" ? "🚀 Complete Secure Pay" : "✅ Finish & Place Order"}
                     </Button>
                     <div className="flex flex-col items-center gap-3 mt-8">
                        <div className="flex items-center gap-3 text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">
                            <span className="w-8 h-px bg-gray-100"></span>
                            Trusted Checkout
                            <span className="w-8 h-px bg-gray-100"></span>
                        </div>
                        <div className="flex items-center gap-5 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 scale-90">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" width={50} height={16} className="h-4 w-auto" alt="Visa"/>
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" width={40} height={24} className="h-6 w-auto" alt="Mastercard"/>
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width={60} height={16} className="h-4 w-auto" alt="Paypal"/>
                        </div>
                     </div>
                   </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
