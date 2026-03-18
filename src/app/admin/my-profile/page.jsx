"use client";
import { Button, CircularProgress, TextField, Collapse } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { MyContext } from "@/admin-context/ThemeProvider";
import { fetchDataFromApi, putData, uploadImagePutData } from "@/admin-utils/api";
import { IoMdCloudUpload } from "react-icons/io";

const MyProfile = () => {
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
    const [preview, setPreview] = useState(null);

    const context = useContext(MyContext);

    useEffect(() => {
        getAdminData();
    }, []);

    const getAdminData = async () => {
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
            setPreview(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const response = await uploadImagePutData("/api/user/upload-avatar", formData);
                if (response?.success) {
                    context.alertBox("success", "Profile picture updated!");
                    // Update global user state with new avatar string
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
            <div className="flex items-center justify-center h-[80vh]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <section className="p-8">
            <div className="w-full max-w-[800px] mx-auto">
                <div className="bg-white shadow-md rounded-md mb-5 p-6">
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                            <p className="text-gray-500 text-sm">Update your personal information</p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() => setIsOpenChangePasswordBox(!isOpenChangePasswordBox)}
                        >
                            {isOpenChangePasswordBox ? "Cancel" : "Change Password"}
                        </Button>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-6 group">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                                        {userForm.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-opacity-90 transition-all border-2 border-white">
                                <IoMdCloudUpload className="text-xl" />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>

                        <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <TextField
                                    name="name"
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    value={userForm.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="email"
                                    label="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    value={userForm.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group md:col-span-2">
                                <label className="text-sm text-gray-600 mb-2 block font-medium">Phone Number</label>
                                <PhoneInput
                                    value={phone}
                                    onChange={(val) => setPhone(val)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="!bg-primary !text-white !font-bold !py-3 !px-8"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <CircularProgress size={24} className="!text-white" /> : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <Collapse in={isOpenChangePasswordBox}>
                    <div className="bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Security Settings</h3>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePasswordUpdate}>
                            <div className="form-group md:col-span-2">
                                <TextField
                                    name="oldPassword"
                                    label="Current Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="!bg-primary !text-white !font-bold !py-3 !px-8"
                                    disabled={isPasswordUpdating}
                                >
                                    {isPasswordUpdating ? <CircularProgress size={24} className="!text-white" /> : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Collapse>
            </div>
        </section>
    );
};

export default MyProfile;
