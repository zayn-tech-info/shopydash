import { memo } from "react";
import SubscriptionBadge from "../common/SubscriptionBadge";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { ShoppingCart, Star, Plus, MapPin, Tag, Package } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function VendorProductItem({ product, vendorId }) {
  const { authUser } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const title = product?.title || product?.name || `Product ${product?._id || ""}`;
  const img = product?.images?.[0] || product?.image || "/public/product-placeholder.png";
  const price = product?.price ? Number(product.price) : 0;
  const originalPrice = product?.originalPrice || price * 1.2;
  const description = product?.description || "";
  const stock = product?.stock ?? product?.quantity ?? null;
  const rating = product?.rating || (Math.random() * 2 + 3).toFixed(1); 
  const sold = product?.sold || Math.floor(Math.random() * 500) + 10;  
  const isOutOfStock = stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();  
    
    try {
      const postId = product.vendorPostId || product.sectionId || product.postId;

      if (!postId) {
        toast.error("Unable to add: Missing info");
        return;
      }

      await addToCart({
        productId: product._id,
        quantity: 1,
        vendorPostId: postId,
        productDetails: {
          title: title,
          price: product.price,
          image: img,
          vendor: product.vendor,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-n-3/10 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative aspect-square bg-n-2/10 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* View Profile Tag */}
        {product?.vendor && (
          <Link
            to={`/p/${product.vendor.username}`}
            className="absolute top-0 right-0 bg-primary-3 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-20 hover:bg-primary-4 transition-colors shadow-sm"
          >
            View Profile
          </Link>
        )}

        {/* Description Overlay on Hover */}
        {description && (
          <div className="absolute inset-0 bg-black/60 p-4 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center backdrop-blur-[2px]">
            <p className="line-clamp-6 font-medium leading-relaxed">{description}</p>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2.5">
        {/* Title (no navigation to product details) */}
        <h3
          className="text-[13px] md:text-base leading-snug text-n-8 font-bold line-clamp-2 min-h-[2.5em] mb-1.5"
          title={title}
        >
          {title}
        </h3>


        {/* Rating & Sold - Mimicking the marketplace style */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center text-orange-400">
            <Star size={10} fill="currentColor" />
            <Star size={10} fill="currentColor" />
            <Star size={10} fill="currentColor" />
            <Star size={10} fill="currentColor" />
            <Star size={10} fill="currentColor" className="text-n-3" />
          </div>
          <span className="text-[10px] text-n-4">{sold} sold</span>
        </div>
 
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-n-8">₦{price.toLocaleString()}</span>
            </div>
            {/* Vendor Name */}
            {product?.vendor && (
               <Link to={`/p/${product.vendor.username}`} className="flex items-center gap-1.5 mt-1.5 group/vendor hover:opacity-80 transition-opacity">
                 <UserAvatar 
                    profilePic={product.vendor.profilePic} 
                    alt={product.vendor.businessName} 
                    className="w-5 h-5 rounded-full border border-n-3/10 shadow-sm flex-shrink-0" 
                 />
                 <span className="text-[11px] font-medium text-n-6 truncate hover:text-primary-3 transition-colors max-w-[100px]">
                   {product.vendor.businessName || product.vendor.username}
                 </span>
                 {product.vendor.subscriptionPlan && (
                   <SubscriptionBadge plan={product.vendor.subscriptionPlan} size="sm" />
                 )}
               </Link>
            )}
          </div>

        
          {String(authUser?._id) !== String(product?.vendorId?._id || product?.vendorId || vendorId) && !isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full border border-primary-3 text-primary-3 flex items-center justify-center hover:bg-primary-3 hover:text-white transition-all shadow-sm active:scale-95 flex-shrink-0"
              title="Add to Cart"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(VendorProductItem);
