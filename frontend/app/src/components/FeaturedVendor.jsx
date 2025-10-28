import { Star } from "lucide-react";
import { VendorsPost } from "../constants";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
 
const getFeaturedVendors = (max = 5) => {
  if (!Array.isArray(VendorsPost)) return [];

  const aggregated = VendorsPost.map((v) => {
    const ratings = Array.isArray(v.products)
      ? v.products.map((p) => Number(p.rating) || 0)
      : [];
    const avg = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    return {
      id: v.id,
      name: v.vendorName,
      avatar: v.vendorAvatar,
      rating: Number(avg.toFixed(1)),
    };
  })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, max);

  return aggregated;
};

export function FeaturedVendor({ limit = 5 }) {
  const vendors = getFeaturedVendors(limit);

  if (!vendors.length) {
    return null; 
  } 

  return (
    <section className="w-full sm:px-6 md:px-10 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Featured Vendors
          </h2>
          <span className="text-sm text-gray-500">
            Top {Math.min(limit, vendors.length)} trusted sellers
          </span>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {vendors.map((vendor) => (
            <article
              key={vendor.id}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {vendor.avatar ? (
                  <img
                    src={vendor.avatar}
                    alt={`${vendor.name} avatar`}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                    {getInitials(vendor.name)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {vendor.name}
                  </p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {vendor.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 px-3 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  View Shop
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
