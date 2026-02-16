import { memo, useMemo } from "react";
import { IndividualProductCard } from "./IndividualProductCard";
import { ProductListSkeleton } from "../skeletons/ProductListSkeleton";
import { Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductsTabComponent({ posts, loading }) {
  const navigate = useNavigate();

  // Flatten all products from all posts
  const allProducts = useMemo(() => {
    if (!posts) return [];
    
    return posts.flatMap((post) =>
      post.products.map((product) => ({
        ...product,
        post: post, // Keep reference to parent post for date, location, etc.
      }))
    );
  }, [posts]);

  if (loading) {
    return <ProductListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
          <p className="text-sm text-gray-500">
            {allProducts.length} {allProducts.length === 1 ? "product" : "products"}
          </p>
        </div>
        <button
          onClick={() => navigate("/vendor/add")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-3 text-white text-sm font-medium rounded-lg hover:bg-primary-4 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      {allProducts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary-3" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No products yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Start selling by adding your first product
          </p>
          <button
            onClick={() => navigate("/vendor/add")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-3 text-white text-sm font-medium rounded-lg hover:bg-primary-4 transition-colors"
          >
            <Plus size={18} />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allProducts.map((product) => (
            <IndividualProductCard
              key={product._id}
              product={product}
              post={product.post}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const ProductsTab = memo(ProductsTabComponent);
