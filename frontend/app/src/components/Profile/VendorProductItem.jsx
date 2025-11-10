import React from "react";

export default function VendorProductItem({ product }) {
  const title =
    product?.title || product?.name || `Product ${product?._id || ""}`;
  const img =
    product?.images?.[0] || product?.image || "/public/product-placeholder.png";
  const price = product?.price ? `₦${product.price}` : null;

  return (
    <div className="border rounded-md p-3 bg-white flex items-center gap-4">
      <div className="w-20 h-20 bg-n-3 rounded overflow-hidden flex-shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-n-9">{title}</div>
        {price && <div className="text-xs text-n-6 mt-1">{price}</div>}
        <div className="text-[11px] text-n-7 mt-2">
          {product?.shortDescription || ""}
        </div>
      </div>
      <div>
        <button className="px-3 py-1 rounded bg-primary-3 text-white text-sm">
          View
        </button>
      </div>
    </div>
  );
}
