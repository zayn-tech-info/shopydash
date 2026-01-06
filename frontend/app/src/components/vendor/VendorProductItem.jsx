import { memo } from "react";
import SubscriptionBadge from "../common/SubscriptionBadge";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
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
        product.vendorPostId || product.sectionId || product.postId;

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
      console.error(error);
    }
  };

  return (
    <div className="bg-white border border-n-3/20 rounded-xl p-3 flex flex-col gap-3 h-full group md:hover:shadow-lg transition-all duration-300 md:hover:-translate-y-1">
      <div className="w-full aspect-square bg-n-2 rounded-lg overflow-hidden relative">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/10 transition-colors duration-300" />
        {product?.vendor && (
          <Link
            to={`/p/${product.vendor.username}`}
            className="absolute top-0 right-0 z-10 bg-primary-3 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg shadow-sm hover:bg-primary-4 transition-colors"
          >
            View Profile
          </Link>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="text-sm font-bold text-n-8 truncate mb-1">{title}</div>

        {price && (
          <div className="text-sm font-code font-bold text-primary-3 mb-2">
            {price}
          </div>
        )}

        {product?.vendor && (
          <div className="flex items-center gap-2 mb-3">
            <UserAvatar
              profilePic={product.vendor.profilePic || product.vendor.logo}
              alt={product.vendor.businessName}
              className="w-6 h-6 border border-n-3 shrink-0"
            />
            <span className="text-xs text-n-5 font-medium truncate">
              {product.vendor.businessName || product.vendor.username}
            </span>
            <SubscriptionBadge
              plan={product.vendor.subscriptionPlan}
              size="sm"
            />
          </div>
        )}

        {authUser?._id &&
          String(authUser._id) !==
            String(product?.vendorId?._id || product?.vendorId || vendorId) && (
            <button
              onClick={handleAddToCart}
              className="w-full h-7 rounded-md bg-primary-3 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-primary-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              {}
              Add to cart
            </button>
          )}
      </div>
    </div>
  );
}

export default memo(VendorProductItem);
