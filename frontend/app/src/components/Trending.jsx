import { Star, ShoppingBag, ShoppingCart, Flame, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { VendorsPost } from "../constants";

// Trending section – mirrors the product tiles used in NearByVendors
export function Trending({ items, limit = 8, title = "Trending Now" }) {
  // Build a default trending list from VendorsPost if no items passed
  const fallback = Array.isArray(VendorsPost)
    ? VendorsPost.flatMap((v) =>
        (v.products || []).map((p) => ({ ...p, vendorName: v.vendorName }))
      )
        .filter(Boolean)
        .sort((a, b) => (b?.rating || 0) - (a?.rating || 0))
    : [];

  const data = (
    Array.isArray(items) && items.length > 0 ? items : fallback
  ).slice(0, limit);

  function handleAddToCart(product) {
    toast.success(`${product.name} added to cart`, {
      id: `cart-${product.id}`,
    });
  }

  function handleBuyNow(product) {
    toast.success(`Buying ${product.name}…`, { id: `buy-${product.id}` });
  }

  const vendorSlug = (name = "") =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="h4 text-n-8 flex items-center gap-2">
            {title}
            <span className="text-2xl">🔥</span>
          </h2>
          <p className="body-2 text-n-4 mt-1">
            Popular items this week on campus.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {data.map((p, idx) => (
          <div
            key={`${p.id ?? p.name}-${p.vendorName ?? ""}-${idx}`}
            className="group relative bg-white rounded-2xl border border-n-3/10 overflow-hidden hover:shadow-xl hover:shadow-n-3/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] bg-n-2/10 overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Price */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-n-8 font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                ₦{Number(p.price).toLocaleString()}
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-n-8/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                <Star size={10} className="fill-primary-3 text-primary-3" />
                <span>
                  {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}
                </span>
              </div>

              {/* Trending/Popular badge */}
              {idx < 3 && (
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-primary-3/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
                    <Flame size={12} />
                    Trending
                  </span>
                </div>
              )}

              {/* Hover overlay: View vendor profile (desktop) */}
              {p.vendorName && (
                <div className="absolute inset-0 hidden md:flex items-center justify-center bg-n-8/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={`/vendor/${vendorSlug(p.vendorName)}`}
                    className="inline-flex items-center justify-center rounded-xl bg-white text-n-8 font-code text-xs font-bold uppercase tracking-wider px-4 py-3 hover:bg-primary-3 hover:text-white transition-colors shadow-lg"
                  >
                    View Shop
                  </a>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-n-8 text-sm truncate mb-1">
                {p.name}
              </h3>
              <p className="text-xs text-n-4 mb-3 truncate">
                by {p.vendorName}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg border border-n-3/20 text-n-6 text-xs font-bold hover:border-primary-3 hover:text-primary-3 transition-colors"
                >
                  <ShoppingCart size={14} /> Add
                </button>
                <button
                  type="button"
                  onClick={() => handleBuyNow(p)}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-primary-3 text-white text-xs font-bold hover:bg-primary-4 transition-colors shadow-md shadow-primary-3/20"
                >
                  <ShoppingBag size={14} /> Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="mt-12 text-center">
          <p className="body-2 text-n-4">No trending items yet.</p>
        </div>
      )}
    </section>
  );
}
