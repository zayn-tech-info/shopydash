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
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="h4 text-n-8">Featured Vendors</h2>
          <p className="body-2 text-n-4 mt-1">
            Top {Math.min(limit, vendors.length)} trusted sellers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {vendors.map((vendor) => (
          <article
            key={vendor.id}
            className="group rounded-2xl border border-n-3/10 bg-white p-5 hover:shadow-xl hover:shadow-n-3/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              {vendor.avatar ? (
                <img
                  src={vendor.avatar}
                  alt={`${vendor.name} avatar`}
                  className="h-14 w-14 rounded-full object-cover border-2 border-n-1 shadow-sm"
                  loading="lazy"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-primary-3/10 text-primary-3 flex items-center justify-center font-code font-bold text-lg">
                  {getInitials(vendor.name)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-bold text-n-8 text-lg">
                  {vendor.name}
                </p>
                <div className="flex items-center gap-1 text-primary-3">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-bold text-n-8">
                    {vendor.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                className="w-full h-10 inline-flex items-center justify-center rounded-xl bg-n-8 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-n-6 transition-colors shadow-md"
              >
                View Shop
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
