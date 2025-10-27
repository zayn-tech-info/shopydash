import {
  MapPin,
  Star,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Compact vendor posts: profile + up to four products
const DEFAULT_POSTS = [
  {
    id: "post-1",
    vendorName: "Amina's Crafts",
    vendorAvatar: null,
    distanceKm: 0.7,
    postedAt: "2h",
    caption: "New handmade arrivals today—limited pieces!",
    products: [
      {
        id: "p-1",
        name: "Handmade Tote Bag",
        image:
          "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop",
        price: 22.5,
        rating: 4.7,
      },
      {
        id: "p-1b",
        name: "Beaded Bracelet",
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
        price: 7.5,
        rating: 4.4,
      },
      {
        id: "p-1c",
        name: "Macrame Keychain",
        image:
          "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=800&auto=format&fit=crop",
        price: 4.0,
        rating: 4.2,
      },
      {
        id: "p-1d",
        name: "Woven Pouch",
        image:
          "https://images.unsplash.com/photo-1610436070184-217dc72f66f6?q=80&w=800&auto=format&fit=crop",
        price: 9.0,
        rating: 4.5,
      },
    ],
  },
  {
    id: "post-2",
    vendorName: "Green Valley Farm",
    vendorAvatar: null,
    distanceKm: 1.2,
    postedAt: "4h",
    caption: "Fresh picks from this morning's harvest!",
    products: [
      {
        id: "p-2",
        name: "Strawberries",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop",
        price: 5.0,
        rating: 4.5,
      },
      {
        id: "p-2b",
        name: "Spinach",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        price: 3.2,
        rating: 4.3,
      },
      {
        id: "p-2c",
        name: "Tomatoes",
        image:
          "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop",
        price: 4.1,
        rating: 4.6,
      },
    ],
  },
];

export function NearByVendors({ posts }) {
  const data = Array.isArray(posts) && posts.length > 0 ? posts : DEFAULT_POSTS;

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
    <section className="px-4 md:px-6 lg:px-8 mt-6 md:mt-8">
      <header className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-n-9">
          Nearby vendors
        </h2>
        <button
          type="button"
          className="text-sm text-primary-3 hover:underline focus:outline-none"
          aria-label="See all nearby vendors"
        >
          See all
        </button>
      </header>

      <div className="space-y-3 md:space-y-4">
        {data.map((post) => (
          <article
            key={post.id}
            className="bg-n-1 border border-stroke-1 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 md:px-4 py-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {post.vendorAvatar ? (
                  <img
                    src={post.vendorAvatar}
                    alt={post.vendorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-2/20 text-primary-3 flex items-center justify-center text-[11px] font-semibold">
                    {initials(post.vendorName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-n-9 truncate">
                    {post.vendorName}
                  </p>
                  <p className="text-[11px] text-n-6 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {post.distanceKm} km
                    </span>
                    <span>•</span>
                    <span>{post.postedAt}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-n-6 hover:text-n-8 p-1 rounded-md hover:bg-n-2"
                aria-label="More"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className="px-3 md:px-4 pb-2 text-[13px] text-n-8">
                {post.caption}
              </div>
            )}

            {/* Product grid */}
            <div className="px-3 md:px-4 pb-2.5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {post.products.slice(0, 4).map((p) => (
                  <div key={p.id} className="group relative">
                    <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-n-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      {/* Price badge */}
                      <div className="absolute top-1.5 left-1.5 bg-white/90 text-n-9 text-[11px] px-1.5 py-0.5 rounded shadow">
                        $ {Number(p.price).toFixed(2)}
                      </div>
                      {/* Rating */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/55 text-white text-[10px] px-1.5 py-0.5 rounded">
                        <Star
                          size={11}
                          className="fill-current text-amber-400"
                        />
                        <span>
                          {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}
                        </span>
                      </div>
                      {/* Name overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                        <p className="text-white text-[11px] truncate">
                          {p.name}
                        </p>
                      </div>
                      {/* Actions overlay (desktop) */}
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
            </div>

            {/* Footer */}
            <div className="px-3 md:px-4 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-stroke-1 text-n-8 hover:bg-n-2/60 text-[13px]"
                >
                  <MessageCircle size={14} /> Message vendor
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-primary-3 hover:bg-primary-3/10 text-[13px]"
                >
                  View profile
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {data.length === 0 && (
        <div className="mt-6 text-center text-sm text-n-6">
          No nearby vendors found yet.
        </div>
      )}
    </section>
  );
}
