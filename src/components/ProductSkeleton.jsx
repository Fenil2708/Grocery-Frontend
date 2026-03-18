import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="productItem shadow-sm w-full bg-white rounded-xl overflow-hidden border border-gray-50 flex flex-col h-full animate-pulse">
            <div className="img w-full h-[180px] bg-gray-100 p-4">
                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
            </div>

            <div className="info p-4 flex flex-col gap-3">
                <div className="h-3 w-1/3 bg-gray-100 rounded-full"></div>
                <div className="h-4 w-full bg-gray-100 rounded-full"></div>
                <div className="h-3 w-1/2 bg-gray-100 rounded-full"></div>
                <div className="flex items-center justify-between mt-2">
                    <div className="h-5 w-1/4 bg-gray-100 rounded-full"></div>
                    <div className="h-8 w-1/2 bg-gray-100 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
