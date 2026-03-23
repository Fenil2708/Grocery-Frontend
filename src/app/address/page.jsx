"use client";
import AccountSidebar from "@/components/AccountSidebar";
import { MyContext } from "@/context/ThemeProvider";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { FiMapPin, FiPlus, FiX, FiAlertTriangle } from "react-icons/fi";
import AddressBox from "./addressBox";
import { fetchDataFromApi, postData, putData, deleteData } from "@/utils/api";

const emptyForm = {
  address_line1: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  mobile: "",
  landmark: "",
  addressType: "Home",
};

const Address = () => {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = adding new
  const [formData, setFormData] = useState(emptyForm);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    await context.getAddressList();
    setIsLoading(false);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (address) => {
    setEditingAddress(address);
    setFormData({
      address_line1: address.address_line1 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "",
      mobile: address.mobile || "",
      landmark: address.landmark || "",
      addressType: address.addressType || "Home",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address_line1 || !formData.city || !formData.state || !formData.pincode) {
      context?.alertBox("error", "Please fill all required fields (Address, City, State, Pincode)");
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (editingAddress) {
        res = await putData(`/api/address/update/${editingAddress._id}`, formData);
      } else {
        res = await postData("/api/address/add", formData);
      }

      if (res?.success) {
        context?.alertBox("success", editingAddress ? "Address updated successfully!" : "Address added successfully!");
        closeDialog();
        loadAddresses();
      } else {
        context?.alertBox("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      context?.alertBox("error", "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteData(`/api/address/delete/${deleteId}`);
      if (res?.success) {
        context?.alertBox("success", "Address deleted successfully!");
        setDeleteConfirmOpen(false);
        loadAddresses();
      } else {
        context?.alertBox("error", res?.message || "Failed to delete address");
      }
    } catch (err) {
      context?.alertBox("error", "An error occurred");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <section className="bg-gray-50 py-6 md:py-10 min-h-[80vh]">
      <div className="container flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-[260px] shrink-0">
          <AccountSidebar />
        </div>

                <div className="flex-1 min-w-0">
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl overflow-hidden mb-6">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="info">
                <h4 className="text-[22px] font-black text-gray-800 tracking-tight leading-none">
                  Saved Addresses
                </h4>
                <p className="text-[13px] text-gray-400 mt-2 font-medium tracking-wide uppercase">Manage your delivery locations</p>
              </div>
              <Button
                className="!bg-primary/5 !text-primary !font-black !px-6 !py-3 !rounded-xl hover:!bg-primary hover:!text-white transition-all !capitalize !text-[13px] shadow-sm active:scale-95"
                onClick={openAddDialog}
              >
                <FiPlus size={18} className="mr-2" />
                Add Address
              </Button>
            </div>

            <div className="p-6 md:p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <CircularProgress size={40} className="text-primary" />
                  <p className="text-gray-400 font-bold mt-4 uppercase text-[11px] tracking-widest">Loading Addresses...</p>
                </div>
              ) : context.addressList.length === 0 ? (
                <div className="py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <FiMapPin className="text-gray-300" size={30} />
                  </div>
                  <p className="text-gray-400 font-bold italic">No addresses found.<br/>Click &quot;Add Address&quot; to add your first one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                    {context.addressList.map((addr) => (
                    <AddressBox
                        key={addr._id}
                        address={addr}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                    />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Address Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
            sx: { borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle className="!px-8 !pt-8 !pb-0">
          <div className="flex items-center justify-between">
            <div>
                <h2 className="text-[20px] font-black text-gray-800 tracking-tight leading-none">
                {editingAddress ? "Update Address" : "New Address"}
                </h2>
                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-2">{editingAddress ? 'Edit' : 'Create'} your delivery location</p>
            </div>
            <Button className="!min-w-0 !w-10 !h-10 !bg-gray-100 !text-gray-400 !rounded-xl hover:!bg-red-50 hover:!text-red-500 transition-all" onClick={closeDialog}>
                <FiX size={20} />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent className="!p-8 !pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="form-group space-y-2">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Type</label>
                    <Select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleChange}
                        fullWidth
                        sx={{ 
                            borderRadius: '14px', 
                            backgroundColor: '#f9f9f9', 
                            '& fieldset': { border: 'none' },
                            height: '50px'
                        }}
                    >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </div>

                <div className="form-group space-y-2">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Line 1*</label>
                    <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleChange}
                        placeholder="House/Flat No, Street, Area"
                        className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] focus:ring-2 focus:ring-primary/20 transition-all px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Landmark</label>
                        <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Near School, Park"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile*</label>
                        <input
                            type="number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile No"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">City*</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">State*</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode*</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Pincode"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                    <div className="form-group space-y-2">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="w-full h-[54px] bg-[#f9f9f9] border-none outline-none rounded-[14px] px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
              <Button
                variant="outlined"
                onClick={closeDialog}
                className="!flex-1 !h-[56px] !rounded-[16px] !border-gray-100 !text-gray-400 !font-black !capitalize hover:!bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="!flex-[2] !h-[56px] !bg-primary !text-white !rounded-[16px] !font-black !capitalize shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress color="inherit" size={24} />
                ) : editingAddress ? (
                  "Update Location"
                ) : (
                  "Save Location"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: { borderRadius: '24px', padding: '10px' }
        }}
      >
        <DialogContent className="!p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500">
               <FiAlertTriangle size={40} />
            </div>
            <h2 className="text-[22px] font-black text-gray-800 tracking-tight leading-none mb-3">Delete Address?</h2>
            <p className="text-gray-400 font-medium text-[15px] leading-relaxed max-w-[280px]">Are you sure you want to remove this address? This action cannot be undone.</p>
            
            <div className="flex items-center gap-3 w-full mt-8">
              <Button 
                fullWidth 
                className="!h-[56px] !rounded-2xl !bg-gray-100 !text-gray-500 !font-black !capitalize hover:!bg-gray-200 transition-all"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
              >
                Keep it
              </Button>
              <Button 
                fullWidth 
                className="!h-[56px] !rounded-2xl !bg-red-500 !text-white !font-black !capitalize shadow-lg shadow-red-200 hover:!bg-red-600 active:scale-95 transition-all"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <CircularProgress size={24} color="inherit" /> : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Address;
