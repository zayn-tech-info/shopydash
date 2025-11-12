export default function VendorProductItem({ product }) {
  const title =
    product?.title || product?.name || `Product ${product?._id || ""}`;
  const img =
    product?.images?.[0] || product?.image || "/public/product-placeholder.png";
  const price = product?.price ? `₦${product.price}` : null;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-4">
      <div className="w-20 h-20 bg-n-3 rounded-md overflow-hidden flex-shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-n-9 truncate">{title}</div>
        {price && <div className="text-xs text-n-6 mt-1">{price}</div>}
        <div className="text-sm text-n-7 mt-2 line-clamp-2">
          {product?.shortDescription || ""}
        </div>
      </div>
      <div>
        <button className="px-3 py-1 rounded-md bg-primary-3 text-white text-sm">
          View
        </button>
      </div>
    </div>
  );
}
