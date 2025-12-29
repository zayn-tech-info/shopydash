
export default function WishlistItem({ item }) {
  
  const title = item?.title || item?.name || `Item: ${item?._id || item}`;
  const price = item?.price ? `₦${item.price}` : null;
  const img =
    item?.images?.[0] || item?.image || "/public/product-placeholder.png";

  return (
    <div className="flex items-center gap-4 p-3 border rounded-md bg-white">
      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-n-9">{title}</div>
        {price && <div className="text-xs text-n-6 mt-1">{price}</div>}
      </div>
      <div>
        <button className="px-3 py-1 text-sm rounded bg-primary-3 text-white">
          Add to cart
        </button>
      </div>
    </div>
  );
}
