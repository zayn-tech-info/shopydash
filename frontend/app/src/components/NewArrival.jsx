import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import VendorProductItem from "./vendor/VendorProductItem";
import { Sparkles, ArrowRight } from "lucide-react";
import { FeedSkeleton } from "./skeletons/FeedSkeleton";

export function NewArrival({ limit = 8 }) {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreshProducts = async () => {
      try {
        const res = await api.get(`/api/v1/post/fresh?limit=${limit}`);
        setArrivals(res.data.data.products);
      } catch (error) {
        console.error("Failed to fetch fresh products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFreshProducts();
  }, [limit]);

  if (!loading && arrivals.length === 0) return null;

  if (loading) return <FeedSkeleton />;

  return (
    <section className="container mx-auto max-w-7xl px-2 md:px-4 py-4">
      {/* Section Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-n-8">New Arrivals</h2>
        <Link 
          to="/feeds?sort=newest"
          className="text-sm font-semibold text-primary-3 hover:text-primary-4 transition-colors flex items-center gap-1"
        >
          See All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {arrivals.map((item) => (
          <VendorProductItem key={item._id} product={item} vendorId={item.vendorId} />
        ))}
      </div>
    </section>
  );
}
