"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { LiaShippingFastSolid, LiaGiftSolid } from "react-icons/lia";
import { LuRotateCcw } from "react-icons/lu"; // Return icon (correct)
import { BsWallet2 } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import Link from "next/link";
import { IoChatboxOutline } from "react-icons/io5";
import { Button, Drawer } from "@mui/material";
import { FaFacebookF, FaPinterest, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { MyContext } from "@/context/ThemeProvider";
import { TextField } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";

const Footer = () => {
  const [phone, setPhone] = useState("");
  const context = useContext(MyContext);
  const [addressData, setAddressData] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    landmark: "",
    addressType: "Home"
  });

  const onChangeInput = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressData.address_line1 || !addressData.city || !addressData.pincode) {
      context.alertBox("error", "Please fill required fields");
      return;
    }

    const payload = { ...addressData, mobile: phone };

    try {
      const res = await context.postData("/api/address/add", payload);
      if (res.success) {
        context.alertBox("success", "Address added");
        context.isOpenAddressPanel();
        // Clear form
        setAddressData({
          address_line1: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          landmark: "",
          addressType: "Home"
        });
        setPhone("");
        // If we have a way to refresh addresses, we should call it here.
        // For now, it will be fetched when Checkout loads.
      } else {
        context.alertBox("error", res.message || "Something went wrong");
      }
    } catch (error) {
       console.log(error);
    }
  }

  return (
    <>
      <footer className="bg-white pt-16 pb-8 border-t border-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 pb-12">
            <div className="col flex items-center justify-center flex-col group text-center p-6 rounded-3xl hover:bg-gray-50/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <LiaShippingFastSolid size={32} />
              </div>
              <h3 className="text-[15px] font-black text-gray-800 tracking-tight">Free Shipping</h3>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                Over $100 Orders
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center p-6 rounded-3xl hover:bg-gray-50/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <LuRotateCcw size={28} />
              </div>
              <h3 className="text-[15px] font-black text-gray-800 tracking-tight">30 Days Returns</h3>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                Easy Exchange
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center p-6 rounded-3xl hover:bg-gray-50/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <BsWallet2 size={26} />
              </div>
              <h3 className="text-[15px] font-black text-gray-800 tracking-tight">Secured Payment</h3>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                Protected by SSL
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center p-6 rounded-3xl hover:bg-gray-50/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <LiaGiftSolid size={32} />
              </div>
              <h3 className="text-[15px] font-black text-gray-800 tracking-tight">Special Gifts</h3>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                On First Order
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center p-6 rounded-3xl hover:bg-gray-50/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-100 col-span-2 md:col-span-1">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <BiSupport size={32} />
              </div>
              <h3 className="text-[15px] font-black text-gray-800 tracking-tight">Support 24/7</h3>
              <p className="text-[12px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                Expert Assistance
              </p>
            </div>
          </div>

          <div className="py-16 border-t border-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-8">
                <div className="col1 w-full md:w-[30%] lg:w-[25%] flex flex-col gap-6">
                <h3 className="text-[20px] font-black text-gray-800 tracking-tight">
                    Contact Us
                </h3>
                <div className="space-y-3">
                    <p className="text-[15px] text-gray-500 leading-relaxed font-medium">
                        BroBazar - Mega Super Store
                        <br />
                        <span className="text-gray-400">507-Union Trade Center France</span>
                    </p>

                    <Link
                        href={"mailto:support@brobazar.com"}
                        className="block text-gray-800 font-black text-[15px] hover:text-primary transition-colors underline underline-offset-4 decoration-gray-100 hover:decoration-primary/30"
                    >
                        support@brobazar.com
                    </Link>

                    <div className="pt-2">
                        <span className="text-[26px] font-black text-primary leading-none tracking-tighter">
                            (+91) 987654321
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mt-6 bg-gray-50/80 p-4 rounded-[20px] border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                            <IoChatboxOutline size={26} />
                        </div>
                        <span className="text-[14px] font-black text-gray-800 leading-tight">
                        Online Chat
                        <br />
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Get Expert Help</span>
                        </span>
                    </div>
                </div>
                </div>

                <div className="col2 w-full md:w-[65%] lg:w-[30%] flex flex-row justify-between gap-8 md:pl-10">
                <div className="box flex-1">
                    <h3 className="text-[18px] font-black text-gray-800 tracking-tight">
                        Explore
                    </h3>
                    <ul className="list mt-6 flex flex-col gap-3">
                    {[
                        "Prices drop", "New products", "Best sales", "Contact us", "Sitemap", "Stores"
                    ].map((item) => (
                        <li key={item} className="list-none">
                        <Link
                            href="/"
                            className="text-[14px] font-bold text-gray-400 hover:text-primary transition-all hover:translate-x-1 inline-block"
                        >
                            {item}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="box flex-1">
                    <h3 className="text-[18px] font-black text-gray-800 tracking-tight">
                        Company
                    </h3>
                    <ul className="list mt-6 flex flex-col gap-3">
                    {[
                        "Delivery", "Legal Notice", "Terms & conditions", "About us", "Secure payment", "Login"
                    ].map((item) => (
                        <li key={item} className="list-none">
                        <Link
                            href="/"
                            className="text-[14px] font-bold text-gray-400 hover:text-primary transition-all hover:translate-x-1 inline-block"
                        >
                            {item}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                <div className="col3 w-full lg:w-[40%] lg:pl-12">
                    <div className="bg-gradient-to-br from-primary/5 to-white p-8 md:p-10 rounded-[32px] border border-gray-50 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                        
                        <h3 className="text-[22px] md:text-[24px] font-black text-gray-800 tracking-tight leading-tight">
                        Join Our Newsletter
                        </h3>
                        <p className="text-[14px] mt-3 text-gray-500 leading-relaxed font-medium">
                        Get weekly updates on new arrivals, exclusive discounts and styling tips directly in your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 w-full mt-8 relative z-10">
                        <div className="flex-1 relative">
                            <input
                                type="email"
                                className="w-full h-[56px] bg-white border-2 border-transparent outline-none rounded-2xl px-6 text-[15px] focus:border-primary/20 transition-all shadow-sm font-bold placeholder:text-gray-300"
                                placeholder="Enter your email"
                            />
                        </div>
                        <Button className="!bg-primary !text-white !font-black !h-[56px] !px-10 !rounded-2xl hover:!bg-secondary transition-all !capitalize shadow-lg shadow-primary/20 active:scale-95 !text-[15px]">
                            Subscribe
                        </Button>
                        </form>
                        <p className="text-[11px] text-gray-300 mt-4 font-bold uppercase tracking-widest text-center sm:text-left">No spam, promise! Unsubscribe anytime.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="bottomStrip py-8 border-t border-gray-50 bg-gray-50/30">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="socials flex items-center gap-3">
              {[
                  {icon: FaFacebookF, color: '#1877F2'}, 
                  {icon: AiOutlineYoutube, color: '#FF0000'}, 
                  {icon: FaPinterest, color: '#E60023'}, 
                  {icon: FaInstagram, color: '#E4405F'}
              ].map((social, i) => (
                    <Link
                        key={i}
                        href={"/"}
                        className="flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 w-10 h-10 hover:scale-110 transition-all text-gray-400 group"
                    >
                        <social.icon
                            size={18}
                            className="group-hover:text-primary transition-colors"
                            style={{ '--hover-color': social.color }}
                        />
                    </Link>
                ))}
            </div>

            <div className="flex flex-col items-center order-3 md:order-2 gap-2">
                <p className="text-center text-[13px] font-black text-gray-300 uppercase tracking-[0.2em]">&copy; 2026 BroBazar Store</p>
                <p className="text-[11px] font-bold text-gray-400">Built with Love for Premium Shopping</p>
            </div>

            <div className="flex items-center gap-3 order-2 md:order-3 opacity-60 grayscale hover:grayscale-0 transition-all">
              <Image src="/pc1.png" alt="Visa" width={35} height={22} className="h-[22px] w-auto" />
              <Image src="/pc2.png" alt="Mastercard" width={35} height={22} className="h-[22px] w-auto" />
              <Image src="/pc3.png" alt="Paypal" width={35} height={22} className="h-[22px] w-auto" />
              <Image src="/pc4.png" alt="Amex" width={35} height={22} className="h-[22px] w-auto" />
              <Image src="/pc5.png" alt="Discover" width={35} height={22} className="h-[22px] w-auto" />
            </div>
          </div>
        </div>
      </footer>

      <Drawer
        open={context?.isOpenAddressBox}
        onClose={context?.isOpenAddressPanel}
        anchor={"right"}
        PaperProps={{
            sx: { width: { xs: '100%', sm: '500px' }, borderLeft: '1px solid #f3f4f6', boxShadow: '-20px 0 60px rgba(0,0,0,0.05)' }
        }}
      >
        <div className="h-full flex flex-col">
            <div className="p-8 md:p-10 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                   <h3 className="text-[22px] font-black text-gray-900 leading-none">Add Address</h3>
                   <p className="text-[12px] text-gray-300 mt-2 font-black uppercase tracking-widest">Delivery Destination Details</p>
                </div>
                <Button 
                    className="!min-w-[44px] !w-[44px] !h-[44px] !rounded-xl !bg-gray-50 !text-gray-400 hover:!bg-red-50 hover:!text-red-500 transition-all"
                    onClick={context?.isOpenAddressPanel}
                >
                    <IoMdClose size={24} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 md:px-10 py-10 custom-scrollbar-premium">
                <form className="space-y-8" onSubmit={handleSaveAddress}>
                    <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Type</label>
                           <div className="flex gap-4">
                                {['Home', 'Office'].map((type) => (
                                    <label key={type} className={`flex-1 relative cursor-pointer group`}>
                                        <input 
                                            type="radio" 
                                            name="addressType" 
                                            className="sr-only" 
                                            value={type} 
                                            checked={addressData.addressType === type}
                                            onChange={onChangeInput}
                                        />
                                        <div className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${addressData.addressType === type ? 'border-primary bg-primary/5 text-primary font-black shadow-lg shadow-primary/5' : 'border-gray-50 text-gray-400 font-bold hover:border-gray-100'}`}>
                                            {type}
                                        </div>
                                    </label>
                                ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Address line 1</label>
                                <TextField
                                    variant="outlined"
                                    className="w-full"
                                    name="address_line1"
                                    value={addressData.address_line1}
                                    onChange={onChangeInput}
                                    required
                                    placeholder="Apartment, suite, unit, etc."
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Landmark (Optional)</label>
                                <TextField
                                    variant="outlined"
                                    className="w-full"
                                    name="landmark"
                                    value={addressData.landmark}
                                    onChange={onChangeInput}
                                    placeholder="Near city center, etc."
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                <TextField
                                    variant="outlined"
                                    className="w-full"
                                    name="city"
                                    value={addressData.city}
                                    onChange={onChangeInput}
                                    required
                                    placeholder="Los Angeles"
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                <TextField
                                    variant="outlined"
                                    className="w-full"
                                    name="state"
                                    value={addressData.state}
                                    onChange={onChangeInput}
                                    placeholder="California"
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    className="w-full"
                                    name="pincode"
                                    value={addressData.pincode}
                                    onChange={onChangeInput}
                                    required
                                    placeholder="90001"
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                                <TextField
                                    variant="outlined"
                                    className="w-full"
                                    name="country"
                                    value={addressData.country}
                                    onChange={onChangeInput}
                                    placeholder="USA"
                                    InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9f9f9', '& fieldset': { border: 'none' } } }}
                                />
                            </div>
                            
                            <div className="space-y-2 col-span-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                <PhoneInput 
                                    value={phone} 
                                    onChange={(p) => setPhone(p)}
                                    className="premium-phone-input"
                                    inputStyle={{ width: '100%', height: '56px', borderRadius: '16px', background: '#f9f9f9', border: 'none', paddingLeft: '60px' }}
                                    containerStyle={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 sticky bottom-0 bg-white">
                        <Button 
                            className="!w-full !bg-primary !text-white !font-black !py-5 !rounded-2xl !text-[16px] !capitalize shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all !h-[64px]" 
                            type="submit"
                            onClick={handleSaveAddress}
                        >
                            Save Shipping Address
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      </Drawer>
    </>
  );
};

export default Footer;
