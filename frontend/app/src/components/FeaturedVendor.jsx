import { Star, Store, ArrowRight } from "lucide-react";
import SubscriptionBadge from "./common/SubscriptionBadge";
import { Link } from "react-router-dom";
import { VendorsPost } from "../constants";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useEffect } from "react";
import UserAvatar from "./UserAvatar";

export function FeaturedVendor({ limit = 10 }) {
  const { vendors, getAllVendorProfile } = useVendorProfileStore();

  useEffect(() => {
    async function getVendors() {
      try {
        await getAllVendorProfile();
      } catch (error) {
        console.error("Failed to fetch featured vendors:", error);
      }
    }
    getVendors();
  }, [getAllVendorProfile]);

  if (!vendors) return null;

  const featuredVendors = vendors.filter(
    (vendor) => vendor.isVerified && vendor.subscriptionPlan === "Shopydash Max"
  );

  if (featuredVendors.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-4">
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

      {/* Vendors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {featuredVendors.slice(0, limit).map((vendor) => (
          <Link 
            key={vendor._id} 
            to={`/p/${vendor.username}`}
            className="group block rounded-xl border border-n-3/15 bg-white p-3 hover:border-primary-3/30 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <UserAvatar
                profilePic={vendor.profilePic}
                alt={`${vendor.businessName} avatar`}
                className="h-12 w-12 border border-n-3/10 shadow-sm rounded-full"
              />

              <div className="min-w-0 w-full">
                <p className="truncate text-sm font-bold underline text-n-8">
                  {vendor.businessName}
                </p>
                
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={10} className="fill-current" />
                    <span className="text-[10px] font-bold text-n-7">
                      {vendor.rating || "5.0"}
                    </span>
                  </div>
                  <SubscriptionBadge
                    plan={vendor.subscriptionPlan}
                    size="xs"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
