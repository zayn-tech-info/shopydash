import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { FeedSkeleton } from "./skeletons/FeedSkeleton";
import VendorProductItem from "./vendor/VendorProductItem";
import { ArrowRight, SearchX } from "lucide-react";

export function NearByVendors({
  posts,
  products: productsProp,
  showHeader = true,
  loading = false,
  title,
  searchTerm,
}) {
  const getCart = useCartStore((state) => state.getCart);

  useEffect(() => {
    getCart();
  }, []);

  const allProducts = useMemo(() => {
    if (productsProp && Array.isArray(productsProp) && productsProp.length > 0) {
      return productsProp;
    }
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
  }, [posts, productsProp]);

  if (loading) {
    return <FeedSkeleton />;
  }

  const hasData = (productsProp && Array.isArray(productsProp)) || (posts && posts.length > 0);
  if (!hasData) {
    return null;
  }

  const headingText =
    typeof title === "string" && title.trim().length > 0
      ? title
      : "Featured Products";

  return (
    <section className="container mx-auto max-w-full px-2 md:px-4 py-4">
      {showHeader && (
        <div className="flex flex-row items-center justify-between gap-4 mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-n-8">{headingText}</h2>
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
        <div className="flex flex-col items-center gap-3 py-12 px-6 text-center bg-n-2/10 rounded-2xl border border-n-3/10">
          <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-n-3/20 flex items-center justify-center">
            <SearchX className="text-primary-3" size={28} />
          </div>
          <p className="text-base md:text-lg font-semibold text-n-8">
            {searchTerm
              ? `Result for "${searchTerm}" not found`
              : "No products found nearby"}
          </p>
          <p className="text-sm text-n-5 max-w-md">
            {searchTerm
              ? "Try adjusting your school, location, or keywords to discover other products."
              : "Try exploring other categories or check back soon for new arrivals."}
          </p>
        </div>
      )}
    </section>
  );
}
