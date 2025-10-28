import { Star, ShoppingBag, ShoppingCart, Flame, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { VendorsPost } from "../constants";

// Trending section – mirrors the product tiles used in NearByVendors
export function Trending({ items, limit = 8, title = "Trending Now" }) {
  // Build a default trending list from VendorsPost if no items passed
  const fallback = Array.isArray(VendorsPost)
    ? VendorsPost.flatMap((v) => v.products || [])
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

  return (
    <section className="md:px-6 lg:px-8 mt-8 md:mt-10">
      <header className="mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-n-9 flex items-center gap-2">
          {title}
          <span aria-hidden>🔥</span>
        </h2>
        <p className="text-[13px] text-n-6">
          Popular items this week on campus.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {data.map((p, idx) => (
          <div key={p.id ?? `${p.name}-${idx}`} className="group relative">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-n-2 border border-stroke-1">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Price */}
              <div className="absolute top-1.5 left-1.5 bg-white/90 text-n-9 text-[11px] px-1.5 py-0.5 rounded shadow">
                $ {Number(p.price).toFixed(2)}
              </div>

              {/* Rating */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/55 text-white text-[10px] px-1.5 py-0.5 rounded">
                <Star size={11} className="fill-current text-amber-400" />
                <span>
                  {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}
                </span>
              </div>

              {/* Trending/Popular badge */}
              <div className="absolute -left-2 top-2 rotate-[-12deg]">
                <span className="inline-flex items-center gap-1 bg-primary-3 text-white text-[10px] px-2 py-0.5 rounded shadow">
                  {idx < 3 ? <Flame size={12} /> : <Zap size={12} />}
                  {idx < 3 ? "Trending" : "Popular"}
                </span>
              </div>

              {/* Name overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                <p className="text-white text-[11px] truncate">{p.name}</p>
              </div>

              {/* Desktop actions */}
              <div className="absolute inset-x-1.5 bottom-1.5 hidden group-hover:flex md:flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-white/95 text-n-9 text-[11px] shadow hover:bg-white"
                >
                  <ShoppingCart size={13} /> Add
                </button>
                <button
                  type="button"
                  onClick={() => handleBuyNow(p)}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-primary-3 text-white text-[11px] shadow hover:opacity-90"
                >
                  <ShoppingBag size={13} /> Buy
                </button>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="mt-1 flex md:hidden items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-[12px] border border-stroke-1 rounded-md text-n-8"
              >
                <ShoppingCart size={12} /> Add
              </button>
              <button
                type="button"
                onClick={() => handleBuyNow(p)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-[12px] rounded-md bg-primary-3 text-white"
              >
                <ShoppingBag size={12} /> Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="mt-6 text-center text-sm text-n-6">
          No trending items yet.
        </div>
      )}
    </section>
  );
}
