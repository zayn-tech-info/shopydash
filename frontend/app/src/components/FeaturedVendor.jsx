import { Star } from "lucide-react";
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
      await getAllVendorProfile();
    }
    getVendors();
  }, [getAllVendorProfile]);

  if (!vendors) return null;

  const featuredVendors = vendors.filter(
    (vendor) => vendor.isVerified && vendor.subscriptionPlan === "Shopydash Max"
  );

  if (featuredVendors.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 pb-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="h4 text-n-8">Featured vendors</h2>
          <p className="body-2 text-n-4 mt-1">
            Top {Math.min(limit, featuredVendors.length)} trusted sellers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {featuredVendors.slice(0, limit).map((vendor) => (
          <article
            key={vendor._id}
            className="group rounded-2xl border border-n-3/10 bg-white p-5 md:hover:shadow-xl md:hover:shadow-n-3/10 transition-all duration-300 md:hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <UserAvatar
                profilePic={vendor.profilePic}
                alt={`${vendor.businessName} avatar`}
                className="h-14 w-14 border-2 border-n-1 shadow-sm"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-n-8 text-lg">
                    {vendor.businessName}
                  </p>
                  <SubscriptionBadge
                    plan={vendor.subscriptionPlan}
                    size="sm"
                    className="flex-shrink-0"
                  />
                </div>
                <div className="flex items-center gap-1 text-primary-3">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-bold text-n-8">
                    {vendor.rating || "5.0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link to={`/p/${vendor.username}`}>
                <button
                  type="button"
                  className="w-full h-10 inline-flex items-center justify-center rounded-xl bg-n-8 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-n-6 transition-colors shadow-md"
                >
                  View Shop
                </button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
