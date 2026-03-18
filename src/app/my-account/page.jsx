"use client";
import AccountSidebar from "@/components/AccountSidebar";
import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Collapse } from "@mui/material";
import { MyContext } from "@/context/ThemeProvider";
import { fetchDataFromApi, putData, uploadImagePutData } from "@/utils/api";
import { IoMdCloudUpload } from "react-icons/io";

const MyAccount = () => {
    const [phone, setPhone] = useState("");
    const [isOpenChangePasswordBox, setIsOpenChangePasswordBox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        mobile: ""
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const context = useContext(MyContext);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchDataFromApi("/api/user/user-details");
            if (response?.success) {
                setUserForm({
                    name: response.data.name,
                    email: response.data.email,
                    mobile: response.data.mobile || ""
                });
                setPhone(response.data.mobile?.toString() || "");
                if (response.data.avatar) {
                    setPreview(`${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${response.data.avatar}`);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const data = {
                ...userForm,
                mobile: phone
            };
            const response = await putData("/api/user/update-user", data);
            if (response?.success) {
                context.alertBox("success", "Profile updated successfully!");
                context.setUser({
                    ...context.user,
                    name: userForm.name,
                    email: userForm.email
                });
            } else {
                context.alertBox("error", response?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
            context.alertBox("error", "Error updating profile!");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            context.alertBox("error", "New password and confirm password do not match!");
            return;
        }
        setIsPasswordUpdating(true);
        try {
            const response = await putData("/api/user/change-password", passwordForm);
            if (response?.success) {
                context.alertBox("success", "Password updated successfully!");
                setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setIsOpenChangePasswordBox(false);
            } else {
                context.alertBox("error", response?.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
            context.alertBox("error", "Error updating password!");
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const response = await uploadImagePutData("/api/user/upload-avatar", formData);
                if (response?.success) {
                    context.alertBox("success", "Profile picture updated!");
                    // Update global user state with new avatar
                    context.setUser({
                        ...context.user,
                        avatar: response.data.avatar
                    });
                } else {
                    context.alertBox("error", response?.message || "Upload failed");
                }
            } catch (error) {
                console.error(error);
                context.alertBox("error", "Error uploading image");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <section className="bg-gray-50 py-6 md:py-10 min-h-[80vh]">
            <div className="container flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="w-full lg:w-[260px] shrink-0">
                    <AccountSidebar />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl overflow-hidden mb-8">
                        <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
                            <div>
                                <h4 className="text-[22px] font-black text-gray-800 tracking-tight leading-none">
                                    Account Settings
                                </h4>
                                <p className="text-[13px] text-gray-400 mt-2 font-medium tracking-wide uppercase">
                                    Update your personal information
                                </p>
                            </div>
                            <Button
                                className="!bg-primary/5 !text-primary !font-black !px-6 !py-3 !rounded-xl hover:!bg-primary hover:!text-white transition-all !capitalize !text-[13px] shadow-sm active:scale-95"
                                onClick={() =>
                                    setIsOpenChangePasswordBox(!isOpenChangePasswordBox)
                                }
                            >
                                {isOpenChangePasswordBox ? "Cancel" : "Change Password"}
                            </Button>
                        </div>

                        <div className="p-6 md:p-10">
                            <div className="flex flex-col items-center mb-12">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-50 flex items-center justify-center transition-all duration-500 group-hover:rounded-2xl">
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-black">
                                                {userForm.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center blur-sm group-hover:blur-0">
                                            <IoMdCloudUpload className="text-white text-3xl transform translate-y-2 group-hover:translate-y-0 transition-transform" />
                                        </div>
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl cursor-pointer shadow-xl hover:bg-secondary transition-all border-4 border-white active:scale-95">
                                        <IoMdCloudUpload className="text-xl" />
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                <div className="text-center mt-6">
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">Avatar Management</span>
                                    <p className="text-[13px] text-gray-400 mt-1 font-medium italic">JPG, PNG or GIF. Max size of 2MB</p>
                                </div>
                            </div>

                            <form className="max-w-[720px] mx-auto space-y-8" onSubmit={handleProfileUpdate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <TextField
                                            id="name"
                                            name="name"
                                            variant="outlined"
                                            className="w-full"
                                            value={userForm.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="John Doe"
                                            InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9fafb', '& fieldset': { border: 'none' } } }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <TextField
                                            id="email"
                                            name="email"
                                            variant="outlined"
                                            className="w-full"
                                            value={userForm.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="john@example.com"
                                            InputProps={{ sx: { borderRadius: '16px', backgroundColor: '#f9fafb', '& fieldset': { border: 'none' } } }}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <PhoneInput
                                            value={phone}
                                            onChange={(phone) => setPhone(phone)}
                                            className="w-full premium-phone-input"
                                            inputStyle={{ width: '100%', height: '56px', borderRadius: '16px', background: '#f9fafb', border: 'none', paddingLeft: '60px' }}
                                            containerStyle={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-end pt-6 border-t border-gray-50">
                                    <Button 
                                        type="submit" 
                                        className="!w-full md:!w-auto !bg-primary !text-white !font-black !px-12 !py-4 !rounded-2xl hover:!bg-secondary transition-all !capitalize shadow-xl shadow-primary/20 disabled:!bg-gray-200 !h-[56px]" 
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <CircularProgress size={24} className="!text-white" /> : "Save Profile"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <Collapse in={isOpenChangePasswordBox}>
                        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                            <div className="p-5 md:p-6 border-b border-gray-100">
                                <h4 className="text-[18px] md:text-[20px] font-bold text-gray-800">
                                    Change Password
                                </h4>
                                <p className="text-[14px] text-gray-500 mt-1">
                                    For your security, please don&apos;t share your password with others
                                </p>
                            </div>

                            <form className="p-5 md:p-8 max-w-[800px] mx-auto" onSubmit={handlePasswordUpdate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="form-group flex flex-col gap-2">
                                        <label className="text-[14px] font-bold text-gray-700 ml-1">Current Password</label>
                                        <TextField
                                            id="oldPassword"
                                            name="oldPassword"
                                            type="password"
                                            variant="outlined"
                                            size="medium"
                                            className="w-full bg-gray-50/50"
                                            value={passwordForm.oldPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Enter current password"
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </div>
                                    <div className="form-group flex flex-col gap-2">
                                        <label className="text-[14px] font-bold text-gray-700 ml-1">New Password</label>
                                        <TextField
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            variant="outlined"
                                            size="medium"
                                            className="w-full bg-gray-50/50"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Enter new password"
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </div>

                                    <div className="form-group flex flex-col gap-2">
                                        <label className="text-[14px] font-bold text-gray-700 ml-1">Confirm New Password</label>
                                        <TextField
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            variant="outlined"
                                            size="medium"
                                            className="w-full bg-gray-50/50"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Confirm new password"
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                                     <Button 
                                        type="submit" 
                                        className="!bg-primary !text-white !font-bold !px-10 !py-3 !rounded-xl hover:!bg-secondary transition-all !capitalize shadow-lg shadow-primary/20 disabled:!bg-gray-300" 
                                        disabled={isPasswordUpdating}
                                    >
                                        {isPasswordUpdating ? <CircularProgress size={24} className="!text-white" /> : "Update Password"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Collapse>
                </div>
            </div>
        </section>
    );
};

export default MyAccount;
