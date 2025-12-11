import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import VendorProductItem from "./vendor/VendorProductItem";

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
        {arrivals.map((item) => (
          <div key={item._id} className="h-full">
            <VendorProductItem product={item} vendorId={item.vendorId} />
          </div>
        ))}
      </div>
    </section>
  );
}
