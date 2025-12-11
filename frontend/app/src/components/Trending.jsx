import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import VendorProductItem from "./vendor/VendorProductItem";

export function Trending({ limit = 20, title = "Trending Now" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get(`/api/v1/post/trending?limit=${limit}`);
        setItems(res.data.data.products);
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [limit]);

  if (!loading && items.length === 0) return null;

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
        {items.map((item) => (
          <div key={item._id} className="h-full">
            <VendorProductItem product={item} vendorId={item.vendorId} />
          </div>
        ))}
      </div>
    </section>
  );
}
