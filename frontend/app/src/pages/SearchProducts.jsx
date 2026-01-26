import SubscriptionBadge from "../components/common/SubscriptionBadge";
import React, { useEffect, useState } from "react";

import { Search, MapPin, Filter } from "lucide-react";
import { useProductStore } from "../store/productStore";
import LocationSelector from "../components/LocationSelector";
import { Link } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";

export function SearchProducts() {
  const [search, setSearch] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { searchProducts, searchResults, isSearching } = useProductStore();

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts({
      search,
      school: schoolName,
      area: selectedArea,
    });
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-n-1 pb-20">
      {}
      <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur-md border-b border-n-3/10 px-4 py-4 md:px-8">
        <form onSubmit={handleSearch} className="max-w-5xl mx-auto space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-n-4"
                size={20}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, e.g. iPhone 12..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-n-2/50 border-none focus:ring-2 focus:ring-primary-3/20 transition-all outline-none text-n-8 placeholder:text-n-4/70 font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 w-12 flex items-center justify-center rounded-xl transition-colors ${
                showFilters || schoolName || selectedArea
                  ? "bg-primary-3 text-white shadow-lg shadow-primary-3/20"
                  : "bg-white border border-n-3/20 text-n-6 hover:border-n-3"
              }`}
            >
              <Filter size={20} />
            </button>
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-n-8 text-white font-code text-xs font-bold uppercase tracking-wider hover:bg-n-7 transition-colors shadow-lg"
            >
              Search
            </button>
          </div>

          {}
          {(showFilters || schoolName || selectedArea) && (
            <div className="pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 bg-white rounded-2xl border border-n-3/10 shadow-sm">
                <LocationSelector
                  schoolName={schoolName}
                  setSchoolName={setSchoolName}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSchoolName("");
                      setSelectedArea("");
                    }}
                    className="text-xs font-bold text-n-4 hover:text-primary-3 font-code uppercase"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {}
      <main className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
        {isSearching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse bg-n-2/50"
              />
            ))}
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <Link
                to={`/p/${product.vendor.username}`}
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden border border-n-3/10 hover:shadow-xl hover:shadow-n-3/5 transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-n-2/20">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-n-8 shadow-sm">
                    ₦{product.price.toLocaleString()}
                  </div>
                  {product.condition && (
                    <div className="absolute top-3 left-3 bg-n-8/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                      {product.condition}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-n-8 text-sm truncate mb-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <UserAvatar
                      profilePic={product.vendor.profilePic}
                      className="w-5 h-5 border border-n-3/20"
                    />
                    <span className="text-xs text-n-5 truncate">
                      {product.vendor.businessName}
                    </span>
                    <SubscriptionBadge
                      plan={product.vendor.subscriptionPlan}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center text-xs text-n-4 gap-1 truncate">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span className="truncate">
                      {product.location}
                      {product.area && `, ${product.area}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-n-2/50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-n-4" />
            </div>
            <h3 className="h5 text-n-8 mb-2">No products found</h3>
            <p className="body-2 text-n-4 max-w-xs mx-auto">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}

        {!isSearching &&
          searchResults.length > 0 &&
          useProductStore.getState().hasMoreSearchResults && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => {
                  searchProducts(
                    {
                      search,
                      school: schoolName,
                      area: selectedArea,
                    },
                    true,
                  );
                }}
                className="group relative px-8 py-3 bg-white border border-n-3/20 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary-3/5 group-hover:bg-primary-3/10 transition-colors" />
                <span className="relative font-code text-xs font-bold uppercase tracking-wider text-n-8 group-hover:text-primary-3 flex items-center gap-2">
                  Load More Products
                  <svg
                    className="w-4 h-4 animate-bounce"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M12 19L5 12M12 19L19 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
      </main>
    </div>
  );
}

export default SearchProducts;
