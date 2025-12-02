export default function VendorProductItem({ product }) {
  const title =
    product?.title || product?.name || `Product ${product?._id || ""}`;
  const img =
    product?.images?.[0] || product?.image || "/public/product-placeholder.png";
  const price = product?.price ? `₦${product.price}` : null;

  return (
    <div className="bg-white border border-n-3/20 rounded-xl p-3 flex flex-col gap-3 h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="w-full aspect-square bg-n-2 rounded-lg overflow-hidden relative">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="text-sm font-bold text-n-8 truncate mb-1">{title}</div>

        {price && (
          <div className="text-sm font-code font-bold text-primary-3 mb-2">
            {price}
          </div>
        )}

        <div className="text-xs text-n-5 line-clamp-2 mb-3 leading-relaxed flex-1">
          {product?.shortDescription || product?.description || ""}
        </div>

        <button className="w-full py-2 rounded-lg bg-n-2 text-n-8 text-xs font-bold uppercase tracking-wider hover:bg-primary-3 hover:text-white transition-all duration-300">
          Message
        </button>
      </div>
    </div>
  );
}
