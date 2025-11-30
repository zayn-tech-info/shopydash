import React from "react";
import { Trash2, MapPin, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const ProductItem = ({ product }) => (
  <div className="group relative rounded-lg border border-gray-100 overflow-hidden bg-gray-50 h-full">
    <div className="aspect-[4/5] w-full overflow-hidden">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-2.5">
      <h4 className="font-medium text-gray-900 text-sm truncate">
        {product.title}
      </h4>
      <div className="flex items-center justify-between mt-1">
        <span className="text-orange-600 font-semibold text-xs">
          ₦{Number(product.price).toLocaleString()}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Sold Out"}
        </span>
      </div>
    </div>
  </div>
);

export function PostCard({ post, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showCarousel = post.products.length > 4;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{post.location}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(post._id)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
          title="Delete entire post"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {post.caption && (
          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            {post.caption}
          </p>
        )}

        {/* Products Display */}
        {showCarousel ? (
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="pb-10" // Add padding for pagination bullets
          >
            {post.products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductItem product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {post.products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
