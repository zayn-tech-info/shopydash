import React from "react";
import { MessageCircle } from "lucide-react";

const ShareToWhatsApp = ({ product, variant = "default" }) => {
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rawBackendUrl =
      import.meta.env.VITE_BACKEND_URL || "https://vendora-7457.onrender.com";
    const baseUrl = rawBackendUrl.replace(/\/api\/v1\/?$/, "");

    const identifier = product.slug || product._id;
    const shareUrl = `${baseUrl}/p/${identifier}`;

    const title = product.title || "Product";
    const priceStr = product.price ? `₦${product.price.toLocaleString()}` : "";

    const message = `Hey! Check out this item on ShopyDash 🛒\n\n*${title}*\nPrice: ${priceStr}\n\nTap the link below to view details:\n${shareUrl}`;

    const encodedMessage = encodeURIComponent(message);
    const waIntent = `https://wa.me/?text=${encodedMessage}`;

    window.open(waIntent, "_blank", "noopener,noreferrer");
  };

  if (!product || (!product.slug && !product._id)) {
    return null;
  }

  const identifier = product.slug || product._id;

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className="w-8 h-8 rounded-full border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm active:scale-95 flex-shrink-0 bg-white"
        title="Share to WhatsApp"
        aria-label="Share to WhatsApp"
      >
        <MessageCircle size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto mt-2"
      aria-label="Share to WhatsApp"
    >
      <MessageCircle size={20} />
      <span>Share to WhatsApp</span>
    </button>
  );
};

export default ShareToWhatsApp;
