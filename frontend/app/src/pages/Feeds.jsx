import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { api } from "../lib/axios";
import { NearByVendors } from "../components/NearByVendors";
import {
  Search,
  MapPin,
  School,
  X,
  ChevronDown,
  Check,
  Loader,
} from "lucide-react";
import { FeedSkeleton } from "../components/skeletons/FeedSkeleton";

import { useSearchParams } from "react-router-dom";

export default function Feeds() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // School Selection State
  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get("school") || ""
  );
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // Location/Area Selection State
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("area") || ""
  );
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [isSearchActive, setIsSearchActive] = useState(false);

  const schoolDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Fetch Schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const res = await api.get("/api/v1/locations/schools");
        if (res.data.success) {
          setSchools(res.data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  // Fetch Areas when School changes or user types in location
  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedSchool) {
        setAreaSuggestions([]);
        return;
      }
      try {
        setLoadingAreas(true);
        const res = await api.get(`/api/v1/locations/areas`, {
          params: {
            schoolName: selectedSchool,
            search: selectedLocation,
          },
        });
        setAreaSuggestions(res.data.areas);
      } catch (error) {
        console.error("Failed to fetch areas", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAreas();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedLocation, selectedSchool]);

  // Handle Click Outside for Dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target)
      ) {
        setShowSchoolDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Feed Posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedSchool) params.school = selectedSchool;
      if (selectedLocation) params.area = selectedLocation;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get("/api/v1/post/feed", { params });
      setPosts(res.data.data.posts);
    } catch (error) {
      // Error silently handled
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedSchool, selectedLocation, searchQuery]);

  // Debounce fetchPosts when searchQuery changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPosts, searchQuery]);

  // Handle immediate fetch for filters
  useEffect(() => {
    if (!searchQuery) fetchPosts();
  }, [selectedSchool, selectedLocation]);

  const filteredPosts = posts; // Direct assignment since filtering is now backend-side

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
                      setSelectedSchool("");
                      setSelectedLocation("");
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
                    ? "max-h-40 mt-4 pb-4 opacity-100 overflow-visible"
                    : "max-h-0 opacity-0"
                }`}
              >
                {/* School Filter */}
                <div className="space-y-2 relative" ref={schoolDropdownRef}>
                  <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2">
                    <School size={14} /> School
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedSchool}
                      onChange={(e) => {
                        setSelectedSchool(e.target.value);
                        setShowSchoolDropdown(true);
                      }}
                      onFocus={() => setShowSchoolDropdown(true)}
                      placeholder="All Schools"
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-n-2/30 border-none outline-none text-sm text-n-8 focus:ring-1 focus:ring-primary-3 focus:bg-white transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
                      {loadingSchools ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showSchoolDropdown ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {showSchoolDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto py-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSchool("");
                            setShowSchoolDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium">All Schools</span>
                          {selectedSchool === "" && (
                            <Check className="w-4 h-4 text-primary-3" />
                          )}
                        </button>
                        {schools
                          .filter((s) =>
                            s
                              .toLowerCase()
                              .includes(selectedSchool.toLowerCase())
                          )
                          .map((school, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSelectedSchool(school);
                                setShowSchoolDropdown(false);
                                setSelectedLocation("");
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between"
                            >
                              <span>{school}</span>
                              {selectedSchool === school && (
                                <Check className="w-4 h-4 text-primary-3" />
                              )}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-2 relative" ref={locationDropdownRef}>
                  <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        selectedSchool
                          ? `Filter by location around ${selectedSchool}...`
                          : "Select a school first"
                      }
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setShowLocationDropdown(true);
                      }}
                      onFocus={() => setShowLocationDropdown(true)}
                      disabled={!selectedSchool}
                      className={`w-full h-10 px-3 pr-10 rounded-lg bg-n-2/30 border-none outline-none text-sm text-n-8 focus:ring-1 focus:ring-primary-3 focus:bg-white transition-colors ${
                        !selectedSchool ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
                      {loadingAreas ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showLocationDropdown ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {showLocationDropdown && selectedSchool && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto py-2">
                        {areaSuggestions.length > 0 ? (
                          areaSuggestions.map((area, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSelectedLocation(area);
                                setShowLocationDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between"
                            >
                              <span>{area}</span>
                              {selectedLocation === area && (
                                <Check className="w-4 h-4 text-primary-3" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-n-4">
                            No areas found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
          <NearByVendors posts={filteredPosts} showHeader={false} />
        )}
      </div>
    </div>
  );
}
