import { Star, ArrowRight } from "lucide-react";
import SubscriptionBadge from "./common/SubscriptionBadge";
import { Link } from "react-router-dom";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useEffect } from "react";
import UserAvatar from "./UserAvatar";
import { Skeleton } from "@mui/material";

const PAID_PLANS = ["Shopydash Boost", "Shopydash Pro", "Shopydash Max"];

function TopSellersSkeleton() {
  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <Skeleton variant="text" width={150} height={32} />
        <Skeleton variant="text" width={70} height={20} />
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-32 bg-white rounded-2xl p-4 border border-n-3/10"
          >
            <div className="flex flex-col items-center gap-3">
              <Skeleton variant="circular" width={56} height={56} />
              <Skeleton variant="text" width={80} height={18} />
              <Skeleton variant="text" width={50} height={14} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TopSellers({ limit = 10 }) {
  const { vendors, getAllVendorProfile, isGettingVendorProfile } = useVendorProfileStore();

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

  if (isGettingVendorProfile) return <TopSellersSkeleton />;
  if (!vendors) return null;

  // Filter vendors with at least Shopydash Boost subscription
  const topSellers = vendors.filter(
    (vendor) => PAID_PLANS.includes(vendor.subscriptionPlan)
  );

  if (topSellers.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-6">
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

      {/* Horizontal Scrollable Vendors */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 md:mx-0 md:px-0">
        {topSellers.slice(0, limit).map((vendor) => (
          <Link 
            key={vendor._id} 
            to={`/p/${vendor.username}`}
            className="flex-shrink-0 group"
          >
            <div className="w-28 md:w-32 bg-white rounded-2xl p-3 md:p-4 border border-n-3/10 hover:border-primary-3/30 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col items-center text-center gap-2">
                {/* Profile Picture */}
                <UserAvatar
                  profilePic={vendor.profilePic}
                  alt={`${vendor.businessName} avatar`}
                  className="h-14 w-14 md:h-16 md:w-16 border-2 border-white shadow-md rounded-full ring-2 ring-primary-3/20"
                />

                {/* Vendor Info */}
                <div className="min-w-0 w-full space-y-1.5">
                  <div className="flex items-center justify-center gap-1">
                    <p className="truncate text-xs md:text-sm font-bold text-n-8 group-hover:text-primary-3 transition-colors max-w-[70px] md:max-w-[80px]">
                      {vendor.businessName}
                    </p>
                    <SubscriptionBadge plan={vendor.subscriptionPlan} size="sm" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-n-7">
                      {vendor.rating || "5.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
