import SubscriptionBadge from "./common/SubscriptionBadge";
import {
  MapPin,
  Star,
  MessageCircle,
  ShoppingCart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { VendorsPost } from "../constants";
import { Link, Links } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useEffect } from "react";
import UserAvatar from "./UserAvatar";
import { useAuthStore } from "../store/authStore";

export function NearByVendors({ posts, showHeader = true }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const getCart = useCartStore((state) => state.getCart);
  const { authUser } = useAuthStore();
  const rawPosts = posts || [];

  useEffect(() => {
    getCart();
  }, []);

  const data = rawPosts.map((post) => {
    if (post._id && post.vendorId) {
      return {
        id: post._id,
        vendorName:
          post.vendorId.businessName || post.vendorId.username || "Vendor",
        vendorAvatar: post.vendorId.logo || post.vendorId.profilePic,
        vendorOwnerId: post.vendorId._id,
        subscriptionPlan: post.vendorId.subscriptionPlan,
        location: post.location,
        postedAt: new Date(post.createdAt).toLocaleDateString(),
        createdAt: post.createdAt,
        caption: post.caption,
        products: (post.products || []).map((p) => ({
          id: p._id,
          name: p.title,
          image: p.image,
          price: p.price,
          rating: 5.0,
          description: p.description,
          condition: p.condition,
        })),
        vendorUsername: post.vendorId.username,
      };
    }
    return post;
  });

  const displayData = posts ? data : VendorsPost;

  const vendorSlug = (name = "") =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const getConditionColors = (condition) => {
    const c = condition?.toLowerCase();
    if (c === "new")
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (c === "used") return "bg-rose-100 text-rose-800 border-rose-200";
    if (c === "like new") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  async function handleAddToCart(product, postId) {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        vendorPostId: postId,
      });
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    }
  }

  function getPostTime(post) {
    if (!post?.createdAt) return { hour: 0, minutes: 0, seconds: 0 };
    const postTime = new Date(post.createdAt);
    const datenow = Date.now();

    const diff = datenow - postTime.getTime();

    const seconds = Math.floor(diff / 1000);
    const min = Math.floor(seconds / 60);
    const hour = Math.floor(min / 60);

    return {
      hour,
      minutes: min % 60,
      seconds: seconds % 60,
    };
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12">
      {showHeader && (
        <header className="flex items-center justify-between mb-6">
          <h2 className="h4 text-n-8">Nearby vendors</h2>
          <Link to="/feeds">
            <button
              type="button"
              className="font-code text-xs font-bold uppercase tracking-wider text-primary-3 hover:text-primary-4 transition-colors"
              aria-label="See all nearby vendors"
            >
              See all
            </button>
          </Link>
        </header>
      )}

      <div className="space-y-8">
        {displayData.map((post, postIndex) => (
          <article
            key={`${post.id ?? `post-${postIndex}`}`}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-n-3/10">
              <div className="flex items-center gap-4 min-w-0">
                <UserAvatar
                  profilePic={post.vendorAvatar}
                  alt={post.vendorName}
                  className="w-10 h-10 border border-n-3/10"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="font-bold text-n-8 truncate">
                      {post.vendorName}
                    </p>
                    <SubscriptionBadge plan={post.subscriptionPlan} size="sm" />
                  </div>
                  <p className="text-xs text-n-4 flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {post.location}
                    </span>

                    <span>
                      {(() => {
                        const { hour, minutes, seconds } = getPostTime(post);
                        if (hour >= 48) {
                          const days = Math.floor(hour / 24);
                          return (
                            <span>
                              • {days} day{days > 1 ? "s" : ""} ago
                            </span>
                          );
                        } else if (hour >= 24) {
                          return <span>• 1 day ago</span>;
                        } else if (hour > 0) {
                          return <span>• {hour}h ago</span>;
                        }
                        if (minutes > 0) return <span>• {minutes}min ago</span>;
                        return <span>• {seconds}s ago</span>;
                      })()}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-n-4 hover:text-n-8 p-2 rounded-full hover:bg-n-2/20 transition-colors"
                aria-label="More"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            {post.caption && (
              <div className="px-6 py-4 text-sm text-n-6 leading-relaxed border-b border-n-3/10">
                {post.caption}
              </div>
            )}

            {}
            <div className="p-6 bg-n-1 relative group/swiper">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: `.swiper-button-next-${post.id ?? postIndex}`,
                  prevEl: `.swiper-button-prev-${post.id ?? postIndex}`,
                }}
                grabCursor
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                }}
                className="w-full"
              >
                {post.products.map((p, pIndex) => (
                  <SwiperSlide
                    key={`${post.id ?? postIndex}-${p.id ?? `p-${pIndex}`}`}
                    className="h-auto"
                  >
                    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden flex flex-col border border-gray-100/50">
                      {}
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {}
                        <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                          <div className="flex justify-between items-start">
                            {}
                            {p.condition ? (
                              <span
                                className={`shadow-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getConditionColors(
                                  p.condition
                                )}`}
                              >
                                {p.condition}
                              </span>
                            ) : (
                              <div />
                            )}

                            <div className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                              <Star
                                size={10}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span>
                                {p.rating?.toFixed
                                  ? p.rating.toFixed(1)
                                  : p.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="p-4 flex flex-col gap-2 flex-grow">
                        {}
                        <h4
                          className="font-medium text-base text-gray-900 line-clamp-1"
                          title={p.name}
                        >
                          {p.name}
                        </h4>

                        {}
                        {p.description && (
                          <p className="text-[10px] leading-relaxed text-gray-500 md:text-xs md:max-h-[1.3rem] md:overflow-hidden md:group-hover:max-h-40 transition-[max-height] duration-[1500ms] ease-in-out">
                            {p.description}
                          </p>
                        )}

                        {}
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <p className="font-code text-lg font-bold text-gray-900">
                            <span className="text-primary-3">₦</span>
                            {p.price?.toLocaleString()}
                          </p>

                          {authUser?._id !== post.vendorOwnerId && (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(p, post.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                              title="Add to cart"
                            >
                              <ShoppingCart size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {}
              <button
                className={`swiper-button-prev-${
                  post.id ?? postIndex
                } absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-3 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary-4 transition-all duration-300 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-lock]:hidden`}
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`swiper-button-next-${
                  post.id ?? postIndex
                } absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-3 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary-4 transition-all duration-300 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-lock]:hidden`}
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="px-6 py-4 bg-white border-t border-n-3/10 flex items-center justify-end gap-3">
              {authUser?._id !== post.vendorOwnerId && (
                <>
                  <Link
                    to={`/p/${
                      post.vendorUsername || vendorSlug(post.vendorName)
                    }`}
                  >
                    <button
                      type="button"
                      className="h-10 px-4 rounded-xl border border-n-3/20 text-n-6 font-code text-xs font-bold uppercase tracking-wider hover:border-primary-3 hover:text-primary-3 transition-colors"
                    >
                      View profile
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-xl bg-primary-3 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-primary-4 transition-colors shadow-md shadow-primary-3/20 flex items-center gap-2"
                  >
                    <MessageCircle size={16} /> Message
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {displayData.length === 0 && (
        <div className="mt-12 text-center">
          <p className="body-2 text-n-4">No nearby vendors found yet.</p>
        </div>
      )}
    </section>
  );
}
