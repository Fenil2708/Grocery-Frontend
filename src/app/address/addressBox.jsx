"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Menu, MenuItem } from "@mui/material";
import { MdHome, MdWork } from "react-icons/md";

const AddressBox = ({ address, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(address);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(address._id);
  };

  return (
    <div className="group relative w-full p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                address?.addressType === "Home" ? 'bg-primary/10 text-primary' : 'bg-orange-50 text-orange-600'
            }`}>
            {address?.addressType === "Home" ? (
                <MdHome size={16} />
            ) : (
                <MdWork size={16} />
            )}
            {address?.addressType || "Home"}
            </span>
            <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
            <span className="text-[12px] font-bold text-gray-400">Default Address</span>
        </div>

        <div className="space-y-1">
            <h3 className="text-[16px] md:text-[18px] text-gray-800 font-black tracking-tight flex flex-wrap items-center gap-x-3 gap-y-1">
            {address?.address_line1}
            {address?.mobile && (
                <span className="text-[13px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">+{address.mobile}</span>
            )}
            </h3>
            <p className="text-[14px] text-gray-500 font-medium leading-relaxed max-w-[90%]">
            {[address?.landmark, address?.city, address?.state, address?.pincode, address?.country]
                .filter(Boolean)
                .join(", ")}
            </p>
        </div>
      </div>

      <div className="action shrink-0">
        <Button
          className="!w-12 !h-12 !min-w-[48px] !rounded-2xl !bg-gray-50 hover:!bg-primary/10 hover:!text-primary transition-all !text-gray-400 shadow-sm"
          onClick={handleClick}
        >
          <HiOutlineDotsVertical size={20} />
        </Button>
        <Menu
          id="address-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          elevation={4}
          sx={{
              '& .MuiPaper-root': {
                  borderRadius: '16px',
                  minWidth: '150px',
                  marginTop: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #f3f4f6'
              }
          }}
        >
          <MenuItem onClick={handleEdit} className="!text-[14px] !font-bold !text-gray-600 !py-2.5 hover:!bg-primary/5 hover:!text-primary">Edit Address</MenuItem>
          <MenuItem onClick={handleDelete} className="!text-[14px] !font-bold !text-red-500 !py-2.5 hover:!bg-red-50">
            Delete Address
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AddressBox;
