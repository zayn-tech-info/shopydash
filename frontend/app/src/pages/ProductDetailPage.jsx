import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart, ArrowLeft, Store, MapPin, Share2 } from "lucide-react";
import ShareProduct from "../components/ShareProduct";
import { ClientProfileSkeleton } from "../components/skeletons/ClientProfileSkeleton";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, currentProduct, isFetchingProduct } =
    useProductStore();
  const { addToCart, isAddingToCart } = useCartStore();

  useEffect(() => {
    if (id) {
      getProductById(id).catch(() => {
        // Handle error implicitly through store state or toast
      });
    }

    return () => {
      useProductStore.setState({ currentProduct: null });
    };
  }, [id, getProductById]);

  if (isFetchingProduct) {
    return <ClientProfileSkeleton />; // Reusing skeleton, consider a specific one later
  }

  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h2 className="h4 font-bold text-n-7 mb-2">Product Not Found</h2>
        <p className="body-2 text-n-5 max-w-xs mb-8">
          The product you are looking for might have been removed or is
          unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-3 hover:bg-primary-2 rounded-xl text-n-1 font-bold transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Go Back Home</span>
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: currentProduct._id,
      price: currentProduct.price,
      vendorId: currentProduct.vendorId,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-n-5 hover:text-n-7 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-n-3/20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="aspect-square md:aspect-auto md:h-full bg-n-2/30 relative">
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col items-start h-full">
            <div className="flex justify-between items-start w-full gap-4">
              <h1 className="h4 font-bold text-n-7 leading-tight mb-2">
                {currentProduct.title}
              </h1>
              <ShareProduct product={currentProduct} variant="icon" />
            </div>

            <p className="h3 font-bold text-primary-3 mb-4">
              ₦{currentProduct.price.toLocaleString()}
            </p>

            {currentProduct.condition && (
              <span className="inline-block px-3 py-1 bg-n-3/20 rounded-full text-xs font-bold text-n-6 mb-6">
                {currentProduct.condition}
              </span>
            )}

            <div className="w-full h-px bg-n-3/20 mb-6"></div>

            <div className="flex-1 mb-6 w-full">
              <h3 className="text-base font-bold text-n-7 mb-2">Description</h3>
              <p className="text-n-5 body-2 whitespace-pre-wrap leading-relaxed">
                {currentProduct.description || "No description provided."}
              </p>
            </div>

            {/* Vendor Details */}
            <div className="w-full p-4 bg-n-2/50 rounded-xl mb-6 flex items-center gap-4">
              {currentProduct.vendor?.profilePic ? (
                <img
                  src={currentProduct.vendor.profilePic}
                  alt={currentProduct.vendor.businessName}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-3/10 flex items-center justify-center shrink-0">
                  <Store size={24} className="text-primary-3" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/p/${currentProduct.vendor?.username}`}
                  className="text-sm font-bold text-n-7 hover:text-primary-3 transition-colors truncate block"
                >
                  {currentProduct.vendor?.businessName ||
                    currentProduct.vendor?.username}
                </Link>
                <div className="flex items-center gap-1 text-xs text-n-5 truncate">
                  <MapPin size={12} />
                  <span className="truncate">
                    {currentProduct.school || "No location"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-3 hover:bg-primary-2 text-white px-6 py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <div className="sm:hidden w-full">
                <ShareProduct product={currentProduct} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
