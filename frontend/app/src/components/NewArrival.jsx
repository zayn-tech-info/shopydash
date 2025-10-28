import { VendorsPost } from "../constants";

const toHours = (t) => {
  if (!t || typeof t !== "string") return Infinity;
  const trimmed = t.trim().toLowerCase();
  const num = parseFloat(trimmed);
  if (Number.isNaN(num)) return Infinity;
  if (trimmed.endsWith("m")) return num / 60;
  if (trimmed.endsWith("h")) return num;
  if (trimmed.endsWith("d")) return num * 24;
  return Infinity;
};

const buildNewArrivals = (withinHours = 24) => {
  if (!Array.isArray(VendorsPost)) return [];

  const items = [];
  for (const post of VendorsPost) {
    const ageHrs = toHours(post.postedAt);
    if (ageHrs <= withinHours && Array.isArray(post.products)) {
      for (const p of post.products) {
        items.push({
          id: `${post.id}-${p.id}`,
          name: p.name,
          price: p.price,
          image: p.image,
          vendorName: post.vendorName,
          ageHrs,
          rating: p.rating,
        });
      }
    }
  }

  // Sort by most recent (smallest hours first)
  return items.sort((a, b) => a.ageHrs - b.ageHrs);
};

export function NewArrival({ withinHours = 24, limit = 8 }) {
  const arrivals = buildNewArrivals(withinHours).slice(0, limit);
  if (!arrivals.length) return null;

  const vendorSlug = (name = "") =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 sm:gap-4 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
            New Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-snug">
            Fresh on Campus — newly listed items from vendors near you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {arrivals.map((item) => (
            <article
              key={item.id}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square w-full bg-gray-50">
                <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white">
                  New
                </span>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}

                {/* Hover overlay: View vendor profile (desktop) */}
                {item.vendorName && (
                  <div className="absolute inset-0 hidden md:flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/vendor/${vendorSlug(item.vendorName)}`}
                      className="inline-flex items-center justify-center rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-white"
                    >
                      View vendor profile
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  by {item.vendorName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{Number(item.price).toLocaleString()}
                  </span>
                  {item.rating ? (
                    <span className="text-xs text-amber-600 font-medium">
                      ★ {item.rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>

                {/* Mobile quick link to vendor profile */}
                {item.vendorName && (
                  <div className="mt-2 md:hidden">
                    <a
                      href={`/vendor/${vendorSlug(item.vendorName)}`}
                      className="text-[12px] text-primary-3 hover:underline"
                    >
                      View vendor profile
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
