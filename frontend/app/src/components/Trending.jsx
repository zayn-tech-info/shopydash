import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import VendorProductItem from "./vendor/VendorProductItem";
import { Flame, ArrowRight } from "lucide-react";

export function Trending({ limit = 8, title = "Trending Now" }) {
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

  if (!loading && items.length < 4) return null;

  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-4">
      {/* Section Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-n-8">{title}</h2>
        <Link 
          to="/feeds?sort=popular"
          className="text-sm font-semibold text-primary-3 hover:text-primary-4 transition-colors flex items-center gap-1"
        >
          See All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {items.map((item) => (
          <VendorProductItem key={item._id} product={item} vendorId={item.vendorId} />
        ))}
      </div>
    </section>
  );
}
