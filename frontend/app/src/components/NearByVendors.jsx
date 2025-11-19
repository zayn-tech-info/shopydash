import {
  MapPin,
  Star,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { VendorsPost } from "../constants";

export function NearByVendors({ posts }) {
  const data = Array.isArray(posts) && posts.length > 0 ? posts : VendorsPost;

  const vendorSlug = (name = "") =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  function initials(name = "") {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function handleAddToCart(product) {
    toast.success(`${product.name} added to cart`, {
      id: `cart-${product.id}`,
    });
  }

  function handleBuyNow(product) {
    toast.success(`Buying ${product.name}…`, { id: `buy-${product.id}` });
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12">
      <header className="flex items-center justify-between mb-6">
        <h2 className="h4 text-n-8">Nearby vendors</h2>
        <button
          type="button"
          className="font-code text-xs font-bold uppercase tracking-wider text-primary-3 hover:text-primary-4 transition-colors"
          aria-label="See all nearby vendors"
        >
          See all
        </button>
      </header>

      <div className="space-y-8">
        {data.map((post, postIndex) => (
          <article
            key={`${post.id ?? `post-${postIndex}`}`}
            className="bg-white border border-n-3/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-n-3/10">
              <div className="flex items-center gap-4 min-w-0">
                {post.vendorAvatar ? (
                  <img
                    src={post.vendorAvatar}
                    alt={post.vendorName}
                    className="w-10 h-10 rounded-full object-cover border border-n-3/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-3/10 text-primary-3 flex items-center justify-center font-code text-xs font-bold">
                    {initials(post.vendorName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-n-8 truncate">
                    {post.vendorName}
                  </p>
                  <p className="text-xs text-n-4 flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {post.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-n-3"></span>
                    <span>{post.postedAt}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-n-4 hover:text-n-8 p-2 rounded-full hover:bg-n-2/20 transition-colors"
                aria-label="More"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            {post.caption && (
              <div className="px-6 py-4 text-sm text-n-6 leading-relaxed border-b border-n-3/10">
                {post.caption}
              </div>
            )}

            {/* Product grid  section */}
            <div className="p-6 bg-n-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {post.products.slice(0, 4).map((p, pIndex) => (
                  <div
                    key={`${post.id ?? postIndex}-${p.id ?? `p-${pIndex}`}`}
                    className="group relative bg-white rounded-xl border border-n-3/10 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] bg-n-2/10 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Price badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-n-8 font-bold text-xs px-2 py-1 rounded-lg shadow-sm">
                        ₦{Number(p.price).toLocaleString()}
                      </div>
                      {/* Rating */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-n-8/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        <Star
                          size={10}
                          className="fill-primary-3 text-primary-3"
                        />
                        <span>
                          {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}
                        </span>
                      </div>

                      {/* Actions overlay (desktop) */}
                      <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center gap-2 bg-n-8/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white text-n-8 font-code text-xs font-bold uppercase tracking-wider hover:bg-n-2 transition-colors"
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyNow(p)}
                          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-primary-3 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-primary-4 transition-colors"
                        >
                          <ShoppingBag size={14} /> Buy
                        </button>
                      </div>
                    </div>

                    <div className="p-3 md:hidden">
                      <h4 className="font-bold text-xs text-n-8 truncate mb-2">
                        {p.name}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          className="flex-1 h-8 flex items-center justify-center rounded-lg border border-n-3/20 text-n-8"
                        >
                          <ShoppingCart size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyNow(p)}
                          className="flex-1 h-8 flex items-center justify-center rounded-lg bg-primary-3 text-white"
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-n-3/10 flex items-center justify-end gap-3">
              <button
                type="button"
                className="h-10 px-4 rounded-xl border border-n-3/20 text-n-6 font-code text-xs font-bold uppercase tracking-wider hover:border-primary-3 hover:text-primary-3 transition-colors"
              >
                View profile
              </button>
              <button
                type="button"
                className="h-10 px-4 rounded-xl bg-primary-3 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-primary-4 transition-colors shadow-md shadow-primary-3/20 flex items-center gap-2"
              >
                <MessageCircle size={16} /> Message
              </button>
            </div>
          </article>
        ))}
      </div>

      {data.length === 0 && (
        <div className="mt-12 text-center">
          <p className="body-2 text-n-4">No nearby vendors found yet.</p>
        </div>
      )}
    </section>
  );
}
