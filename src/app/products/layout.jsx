import React, { Suspense } from "react";

export const metadata = {
    title: "Products | Grocery Store",
    description: "Browse all products by category",
};

const ProductsPageLayout = ({ children }) => {
    return (
        <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading...</div>}>
            {children}
        </Suspense>
    );
}

export default ProductsPageLayout;