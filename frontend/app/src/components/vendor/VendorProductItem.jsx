import { memo } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

function VendorProductItem({ product, vendorId }) {
  const { authUser } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const title =
    product?.title || product?.name || `Product ${product?._id || ""}`;
  const img =
    product?.images?.[0] || product?.image || "/public/product-placeholder.png";
  const price = product?.price ? `₦${product.price}` : null;

  const handleAddToCart = async () => {
    try {
      if (!authUser) {
        toast.error("Please login to add items to cart");
        return;
      }

      const postId =
        product.vendorPostId || product.sectionId || product.postId; // Fallback attempts

      if (!postId) {
        toast.error("Unable to add this item: Missing post reference");
        console.error("Product missing vendorPostId:", product);
        return;
      }

      await addToCart({
        productId: product._id,
        quantity: 1,
        vendorPostId: postId,
      });
    } catch (error) {
      // Error handling is mostly in store, but safety check
      console.error(error);
    }
  };

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

        {authUser?._id !==
          (product?.vendorId?._id || product?.vendorId || vendorId) && (
          <button
            onClick={handleAddToCart}
            className="w-full h-10 rounded-xl bg-primary-3 text-white font-code text-xs font-bold uppercase tracking-wider px-2 flex text-nowrap items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart size={16} />
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(VendorProductItem);
