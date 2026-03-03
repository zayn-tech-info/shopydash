import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SubscriptionBadge from "./common/SubscriptionBadge";
import { Link } from "react-router-dom";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Skeleton } from "@mui/material";

const PAID_PLANS = ["Shopydash Boost", "Shopydash Pro", "Shopydash Max"];

const CARD_WIDTH = "w-52 sm:w-60 md:w-64";
const COVER_ASPECT = "aspect-[2/1]";

function TopSellersSkeleton() {
  return (
    <section className="container mx-auto max-w-full px-2 md:px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <Skeleton variant="text" width={150} height={32} />
        <Skeleton variant="text" width={70} height={20} />
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 md:mx-0 md:px-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${CARD_WIDTH} bg-white rounded-2xl overflow-hidden border border-n-3/10`}
          >
            <Skeleton variant="rectangular" className="w-full aspect-[2/1]" />
            <div className="p-3 pt-10 sm:pt-12 min-h-[88px] space-y-2">
              <Skeleton variant="text" width="80%" height={20} />
              <div className="flex gap-3">
                <Skeleton variant="text" width={60} height={14} />
                <Skeleton variant="text" width={50} height={14} />
                <Skeleton variant="text" width={45} height={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const SCROLL_AMOUNT = 280; // approximate card width + gap for one step

export function TopSellers({ limit = 10 }) {
  const { vendors, getAllVendorProfile, isGettingVendorProfile } = useVendorProfileStore();
  const scrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const topSellers = vendors
    ? vendors.filter((v) => PAID_PLANS.includes(v.subscriptionPlan))
    : [];

  useEffect(() => {
    async function getVendors() {
      try {
        await getAllVendorProfile();
      } catch (error) {
        console.error("Failed to fetch top sellers:", error);
      }
    }
    if (!vendors) {
      getVendors();
    }
  }, [getAllVendorProfile, vendors]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [topSellers.length]);

  if (isGettingVendorProfile) return <TopSellersSkeleton />;
  if (!vendors) return null;
  if (topSellers.length === 0) return null;

  const handlePrev = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const handleNext = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto max-w-full px-2 md:px-4 py-6">
      {/* Section Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-n-8">Top Sellers</h2>
        <Link 
          to="/feeds"
          className="text-sm font-semibold text-primary-3 hover:text-primary-4 transition-colors flex items-center gap-1"
        >
          See All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Carousel wrapper with prev/next buttons */}
      <div className="relative">
        {canScrollPrev && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous sellers"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-n-4 text-white border border-n-4 shadow-lg flex items-center justify-center hover:bg-n-4 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-3/40"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
        )}
        {canScrollNext && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next sellers"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-n-4 text-white border border-n-4 shadow-lg flex items-center justify-center hover:bg-n-4 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-3/40"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        )}

        {/* Horizontal Scrollable Vendors */}
        <div
          ref={scrollRef}
          className="relative z-0 flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth -mx-2 px-2 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {topSellers.slice(0, limit).map((vendor) => (
          <Link
            key={vendor._id}
            to={`/p/${vendor.username}`}
            className={`flex-shrink-0 ${CARD_WIDTH} group`}
          >
            <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-n-3/10 hover:border-primary-3/30 hover:shadow-md transition-all duration-300">
              {/* Top section: cover image */}
              <div
                className={`relative w-full ${COVER_ASPECT} overflow-hidden bg-gradient-to-br from-[#fdf4ef] via-[#f5e8e0] to-[#ebe2dc]`}
              >
                {vendor.coverImage ? (
                  <img
                    src={vendor.coverImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#fdf4ef] via-[#f5e8e0] to-[#ebe2dc]"
                    aria-hidden
                  />
                )}
              </div>

              {/* Profile image overlay: half on cover, half on info */}
              <div className="absolute left-2 sm:left-3 bottom-[4rem] sm:bottom-[4.25rem] z-20 pointer-events-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white bg-white shadow-lg overflow-hidden ring-2 ring-n-3/10">
                  <UserAvatar
                    profilePic={vendor.profilePic}
                    alt={`${vendor.businessName} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom section: vendor info stacked over cover */}
              <div className="relative z-10 -mt-5 sm:-mt-6 pt-10 sm:pt-12 px-3 pb-4 min-h-[92px] flex flex-col justify-center bg-white">
                <div className="flex items-center gap-1.5 min-w-0 mb-2">
                  <p className="truncate text-sm font-bold text-n-8 group-hover:text-primary-3 transition-colors">
                    {vendor.businessName}
                  </p>
                  <SubscriptionBadge plan={vendor.subscriptionPlan} size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-n-6">
                  <span>
                    <span className="font-semibold text-n-7">
                      {vendor.productCount ?? 0}
                    </span>{" "}
                    products
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Star
                      size={12}
                      className="fill-amber-400 text-amber-400 flex-shrink-0"
                    />
                    <span className="font-semibold text-n-7">
                      {vendor.rating != null
                        ? Number(vendor.rating).toFixed(1)
                        : "—"}
                    </span>
                  </span>
                  <span>
                    <span className="font-semibold text-n-7">
                      {vendor.numReviews ?? 0}
                    </span>{" "}
                    reviews
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
