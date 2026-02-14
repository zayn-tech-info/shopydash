import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { FeedSkeleton } from "./skeletons/FeedSkeleton";
import VendorProductItem from "./vendor/VendorProductItem";
import { Grid3X3, ArrowRight } from "lucide-react";

export function NearByVendors({ posts, showHeader = true, loading = false }) {
  const getCart = useCartStore((state) => state.getCart);
  const { authUser } = useAuthStore();

  useEffect(() => {
    getCart();
  }, []);

  const allProducts = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const products = [];
    posts.forEach((post) => {
      if (post.products && Array.isArray(post.products)) {
        post.products.forEach((product) => {
          
          products.push({
            ...product,
            _id: product._id, 
            name: product.title, 
            price: product.price,
            image: product.image,
            vendorPostId: post._id, 
            vendor: {
              _id: post.vendorId?._id,
              username: post.vendorId?.username,
              businessName:
                post.vendorId?.businessName || post.vendorId?.username,
              profilePic: post.vendorId?.profilePic || post.vendorId?.logo,
              subscriptionPlan: post.vendorId?.subscriptionPlan,
            },
            location: post.location,
            createdAt: post.createdAt,
          });
        });
      }
    });

    
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }

    return products;
  }, [posts]);

  if (loading) {
    return <FeedSkeleton />;
  }

  if (!posts) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-4">
      {showHeader && (
        <div className="flex flex-row items-center justify-between gap-4 mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-n-8">Featured Products</h2>
          <Link 
            to="/feeds"
            className="text-sm font-semibold text-primary-3 hover:text-primary-4 transition-colors flex items-center gap-1"
          >
            See All <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {allProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {allProducts.map((product) => (
            <VendorProductItem 
              key={`${product._id}-${product.vendorPostId}`} 
              product={product} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-n-2/10 rounded-xl border border-n-3/10">
          <p className="text-n-5 text-sm font-medium">No products found nearby</p>
        </div>
      )}
    </section>
  );
}
