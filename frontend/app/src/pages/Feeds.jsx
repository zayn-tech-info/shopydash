import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { NearByVendors } from "../components/NearByVendors";
import { Search, MapPin, School, X } from "lucide-react";
import { schools } from "../constants";
import { FeedSkeleton } from "../components/skeletons/FeedSkeleton";

export default function Feeds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [selectedSchool, selectedLocation]); // Re-fetch when filters change

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedSchool) params.school = selectedSchool;
      // Note: Backend currently only supports school filtering.
      // Location filtering might need backend update or client-side filtering.

      const res = await api.get("/api/v1/post/feed", { params });
      let fetchedPosts = res.data.data.posts;

      // Client-side filtering for location if backend doesn't support it yet
      if (selectedLocation) {
        fetchedPosts = fetchedPosts.filter((post) =>
          post.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }

      // Client-side filtering for search query (caption or vendor name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        fetchedPosts = fetchedPosts.filter(
          (post) =>
            post.caption?.toLowerCase().includes(query) ||
            post.vendorId?.businessName?.toLowerCase().includes(query) ||
            post.vendorId?.username?.toLowerCase().includes(query)
        );
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debounce could be better, but simple for now
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen">
      {/* Search Overlay Background */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSearchActive(false)}
        />
      )}

      {/* Search Bar Section */}
      <div
        className={`sticky top-20 z-50 transition-all duration-300 ${
          isSearchActive ? "py-6" : "py-4"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div
            className={`bg-white rounded-2xl shadow-sm border border-n-3/10 transition-all duration-300 ${
              isSearchActive ? "scale-105 shadow-xl" : ""
            }`}
          >
            <div className="p-2">
              <div className="flex items-center gap-2 bg-n-2/30 rounded-xl px-4 py-2">
                <Search className="text-n-4" size={20} />
                <input
                  type="text"
                  placeholder="Search vendors, products..."
                  className="flex-1 bg-transparent border-none outline-none text-n-8 placeholder:text-n-4 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                />
                {isSearchActive && (
                  <button
                    onClick={() => {
                      setIsSearchActive(false);
                      setSearchQuery("");
                    }}
                    className="p-1 hover:bg-n-3/20 rounded-full text-n-4 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Expanded Filters */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 px-4 transition-all duration-300 overflow-hidden ${
                  isSearchActive
                    ? "max-h-40 mt-4 pb-4 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2">
                    <School size={14} /> School
                  </label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-n-2/30 border-none outline-none text-sm text-n-8 focus:ring-1 focus:ring-primary-3"
                  >
                    <option value="">All Schools</option>
                    {schools.map((school, index) => (
                      <option key={index} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> Location
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-n-2/30 border-none outline-none text-sm text-n-8 focus:ring-1 focus:ring-primary-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {loading ? (
          <FeedSkeleton />
        ) : (
          <NearByVendors posts={posts} showHeader={false} />
        )}
      </div>
    </div>
  );
}
