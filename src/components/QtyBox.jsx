"use client";
import { Button } from '@mui/material'
import React from 'react'
import { LiaAngleDownSolid } from "react-icons/lia";
import { TfiAngleUp } from "react-icons/tfi";

const QtyBox = ({ value, onChange }) => {
    const minusQty = () => {
        if (value > 1) {
            onChange(value - 1);
        }
    };

    const plusQty = () => {
        onChange(value + 1);
    }

    return (
        <div className='qtyBox flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm'>
            <Button 
                className='!min-w-[36px] !w-[36px] !h-[36px] !rounded-lg !text-gray-600 hover:!bg-white-100 hover:!text-primary transition-all !p-0' 
                onClick={minusQty}
            >
                <LiaAngleDownSolid size={18} className="rotate-90" />
            </Button>
            
            <input
                type="number"
                className='border-0 outline-none w-[45px] text-center bg-transparent text-[15px] font-black text-gray-800'
                value={value}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) {
                        onChange(val);
                    } else if (e.target.value === "") {
                        onChange("");
                    }
                }}
                onBlur={() => {
                    if (value === "" || value < 1) {
                        onChange(1);
                    }
                }}
            />

            <Button 
                className='!min-w-[36px] !w-[36px] !h-[36px] !rounded-lg !text-gray-600 hover:!bg-white-100 hover:!text-primary transition-all !p-0' 
                onClick={plusQty}
            >
                <TfiAngleUp size={16} className="rotate-90" />
            </Button>
        </div>
    )
}

export default QtyBox