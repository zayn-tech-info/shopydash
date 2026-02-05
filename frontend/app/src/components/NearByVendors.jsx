import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { FeedSkeleton } from "./skeletons/FeedSkeleton";
import VendorProductItem from "./vendor/VendorProductItem";

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
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 pb-20">
      {showHeader && (
        <header className="flex items-center justify-between mb-8">
          <h2 className="h4 text-n-8">Featured products</h2>
          <Link to="/feeds">
            <button
              type="button"
              className="font-code text-xs font-bold uppercase tracking-wider text-primary-3 hover:text-primary-4 transition-colors"
              aria-label="See all products"
            >
              See all
            </button>
          </Link>
        </header>
      )}

      {allProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {allProducts.map((product) => (
            <div
              key={`${product._id}-${product.vendorPostId}`}
              className="h-full"
            >
              <VendorProductItem product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-n-3/10">
          <p className="body-2 text-n-4">No products found nearby.</p>
        </div>
      )}
    </section>
  );
}
