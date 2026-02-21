import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

const ShareProduct = ({ product, variant = "default" }) => {
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rawBackendUrl =
      import.meta.env.VITE_BACKEND_URL || "https://api.shopydash.com";
    const baseUrl = rawBackendUrl.replace(/\/api\/v1\/?$/, "");

    const identifier = product.slug || product._id;
    const shareUrl = `${baseUrl}/share/${identifier}`;

    const title = product.title || "Product";
    const priceStr = product.price ? `₦${product.price.toLocaleString()}` : "";

    const message = `Hey! Check out this item on Shopydash\n\n*${title}*\nPrice: ${priceStr}\n\nTap the link below to view details:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Product",
          text: message,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(`${message}\n${shareUrl}`);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!product || (!product.slug && !product._id)) {
    return null;
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className="w-8 h-8 rounded-full border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-95 flex-shrink-0 bg-white"
        title="Share"
        aria-label="Share"
      >
        <Share2 size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto mt-2"
      aria-label="Share"
    >
      <Share2 size={20} />
      <span>Share Product</span>
    </button>
  );
};

export default ShareProduct;
