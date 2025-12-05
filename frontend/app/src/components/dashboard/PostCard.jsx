import { memo } from "react";
import {
  Trash2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useProductStore } from "../../store/productStore";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductItem = memo(({ product }) => (
  <div className="group/item relative flex flex-col gap-3">
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100 border-2">
      <img
        src={product.image}
        alt={product.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
      />
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/20 ${
            product.stock > 0
              ? "bg-white/90 text-green-700"
              : "bg-gray-900/90 text-white"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Sold Out"}
        </span>
      </div>
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="space-y-1">
      <div className="flex justify-between items-start gap-3">
        <h4
          className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1"
          title={product.title}
        >
          {product.title}
        </h4>
        <span className="font-bold text-primary-3 text-sm whitespace-nowrap">
          ₦{Number(product.price).toLocaleString()}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-1">
        {product.condition} • {product.category}
      </p>
    </div>
  </div>
));

function PostCardComponent({ post, onDelete }) {
  const { deletePost } = useProductStore();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="group bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Calendar size={12} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.location && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <MapPin size={14} className="text-primary-3" />
              <span>{post.location}</span>
            </div>
          )}
        </div>

        {/* Actions - Visible on Hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => navigate("/vendor/add", { state: { post } })}
            className="p-2 text-gray-400 hover:text-primary-3 hover:bg-orange-50 rounded-full transition-colors"
            title="Edit post"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={async () => await deletePost(post._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed font-light">
          {post.caption}
        </p>
      )}

      {/* Products Display */}
      <div className="relative group/swiper -mx-2 px-2">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1.2}
          navigation={{
            nextEl: `.swiper-button-next-${post._id}`,
            prevEl: `.swiper-button-prev-${post._id}`,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-12"
        >
          {post.products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductItem product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className={`swiper-button-prev-${post._id} absolute left-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-primary-3 text-n-1 border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-2 hover:text-white hover:border-primary-4 transition-all duration-300 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-lock]:hidden`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className={`swiper-button-next-${post._id} absolute right-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-primary-3 text-n-1 border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-2 hover:text-white hover:border-primary-4 transition-all duration-300 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-lock]:hidden`}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export const PostCard = memo(PostCardComponent);
