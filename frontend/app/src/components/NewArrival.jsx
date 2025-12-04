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
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="h4 text-n-8">New Arrivals</h2>
          <p className="body-2 text-n-4 mt-1">
            Fresh on Campus — newly listed items from vendors near you.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 font-code text-xs font-bold uppercase tracking-wider text-primary-3 hover:text-primary-4 transition-colors">
          View all items
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {arrivals.map((item, idx) => (
          <article
            key={`${item.id}-${idx}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="relative aspect-square bg-n-2/10 overflow-hidden">
              <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-lg bg-primary-3/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                New
              </span>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : null}

              {item.vendorName && (
                <div className="absolute inset-0 hidden md:flex items-center justify-center bg-n-8/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={`/p/${vendorSlug(item.vendorName)}`}
                    className="inline-flex items-center justify-center rounded-xl bg-white text-n-8 font-code text-xs font-bold uppercase tracking-wider px-4 py-3 hover:bg-primary-3 hover:text-white transition-colors shadow-lg"
                  >
                    View Shop
                  </a>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-n-8 text-sm truncate mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-n-4 mb-3 truncate">
                by {item.vendorName}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-n-8">
                  ₦{Number(item.price).toLocaleString()}
                </span>
                {item.rating ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-n-8 bg-n-2/20 px-1.5 py-0.5 rounded">
                    ★ {item.rating.toFixed(1)}
                  </span>
                ) : null}
              </div>

              {item.vendorName && (
                <div className="mt-3 md:hidden pt-3 border-t border-n-3/10">
                  <a
                    href={`/p/${vendorSlug(item.vendorName)}`}
                    className="block text-center font-code text-[10px] font-bold uppercase tracking-wider text-primary-3"
                  >
                    View Shop
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
