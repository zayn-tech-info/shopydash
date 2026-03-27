import { BottomNav } from "../components/BottomNav";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { TopSellers } from "../components/TopSellers";
import { api } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import {
  Search,
  MapPin,
  School,
  X,
  ChevronDown,
  Loader,
  Check,
} from "lucide-react";
import { useProductStore } from "../store/productStore";

export function Home() {
  const { authUser } = useAuthStore();
  const feedPosts = useProductStore((state) => state.feedPosts);
  const getFeedPosts = useProductStore((state) => state.getFeedPosts);
  const isFetchingFeedPosts = useProductStore(
    (state) => state.isFetchingFeedPosts,
  );
  const featuredProducts = useProductStore((state) => state.featuredProducts);
  const getFeaturedProducts = useProductStore(
    (state) => state.getFeaturedProducts,
  );
  const searchFeaturedProducts = useProductStore(
    (state) => state.searchFeaturedProducts,
  );
  const isFetchingFeaturedProducts = useProductStore(
    (state) => state.isFetchingFeaturedProducts,
  );

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [schoolDropdownStyle, setSchoolDropdownStyle] = useState(null);
  const [locationDropdownStyle, setLocationDropdownStyle] = useState(null);
  const schoolDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const schoolDropdownListRef = useRef(null);
  const locationDropdownListRef = useRef(null);
  const searchInputRef = useRef(null);
  const resetGuardRef = useRef(false);
  const featuredSectionRef = useRef(null);

  const [lastSearchTerm, setLastSearchTerm] = useState("");

  useEffect(() => {
    getFeedPosts();
    getFeaturedProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleExternalTrigger = () => {
      setIsSearchActive(true);
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    };

    window.addEventListener("open-feeds-search", handleExternalTrigger);
    return () =>
      window.removeEventListener("open-feeds-search", handleExternalTrigger);
  }, []);

  useEffect(() => {
    const handleHotkeys = (event) => {
      const key = event.key.toLowerCase();
      const wantsPalette = (event.ctrlKey || event.metaKey) && key === "k";
      if (wantsPalette) {
        event.preventDefault();
        setIsSearchActive(true);
      }
      if (key === "escape") {
        setIsSearchActive(false);
      }
    };

    window.addEventListener("keydown", handleHotkeys);
    return () => window.removeEventListener("keydown", handleHotkeys);
  }, []);

  useEffect(() => {
    if (!isSearchActive) return;
    const inputEl = searchInputRef.current;
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  }, [isSearchActive]);

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

    const delay = setTimeout(() => {
      fetchAreas();
    }, 500);

    return () => clearTimeout(delay);
  }, [selectedLocation, selectedSchool]);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedSchoolDropdown =
        schoolDropdownRef.current?.contains(event.target) ||
        schoolDropdownListRef.current?.contains(event.target);
      if (!clickedSchoolDropdown) {
        setShowSchoolDropdown(false);
        setSchoolDropdownStyle(null);
      }
      const clickedLocationDropdown =
        locationDropdownRef.current?.contains(event.target) ||
        locationDropdownListRef.current?.contains(event.target);
      if (!clickedLocationDropdown) {
        setShowLocationDropdown(false);
        setLocationDropdownStyle(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateDropdownStyle = useCallback((ref, setter) => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setter({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!showSchoolDropdown) return;
    const handler = () =>
      updateDropdownStyle(schoolDropdownRef, setSchoolDropdownStyle);
    handler();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [showSchoolDropdown, updateDropdownStyle]);

  useEffect(() => {
    if (!showLocationDropdown) return;
    const handler = () =>
      updateDropdownStyle(locationDropdownRef, setLocationDropdownStyle);
    handler();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [showLocationDropdown, updateDropdownStyle]);

  useEffect(() => {
    if (isSearchActive) return;
    setShowSchoolDropdown(false);
    setSchoolDropdownStyle(null);
    setShowLocationDropdown(false);
    setLocationDropdownStyle(null);
  }, [isSearchActive]);

  const scrollToFeatured = useCallback(() => {
    requestAnimationFrame(() => {
      featuredSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const fetchFeaturedSearchResults = useCallback(async () => {
    const params = {};
    const trimmedQuery = searchQuery.trim();
    if (selectedSchool) params.school = selectedSchool;
    if (selectedLocation) params.area = selectedLocation;
    if (trimmedQuery) params.search = trimmedQuery;

    const hasFilters = Object.keys(params).length > 0;
    if (!hasFilters) {
      resetGuardRef.current = true;
      return getFeaturedProducts();
    }
    resetGuardRef.current = true;
    await searchFeaturedProducts(params);
  }, [
    selectedSchool,
    selectedLocation,
    searchQuery,
    searchFeaturedProducts,
    getFeaturedProducts,
  ]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const delay = setTimeout(() => {
      fetchFeaturedSearchResults();
    }, 500);

    return () => clearTimeout(delay);
  }, [fetchFeaturedSearchResults, searchQuery]);

  useEffect(() => {
    if (!selectedSchool && !selectedLocation) return;
    fetchFeaturedSearchResults();
  }, [selectedSchool, selectedLocation, fetchFeaturedSearchResults]);

  useEffect(() => {
    if (!resetGuardRef.current) return;
    if (selectedSchool || selectedLocation || searchQuery.trim()) return;
    getFeaturedProducts();
  }, [selectedSchool, selectedLocation, searchQuery, getFeaturedProducts]);

  const executeSearch = useCallback(() => {
    return fetchFeaturedSearchResults();
  }, [fetchFeaturedSearchResults]);

  const handleSearchAction = useCallback(
    async (shouldScroll = false) => {
      await executeSearch();
      setLastSearchTerm(searchQuery.trim());
      setIsSearchActive(false);
      searchInputRef.current?.blur();
      if (shouldScroll) {
        scrollToFeatured();
      }
    },
    [executeSearch, searchQuery, scrollToFeatured],
  );

  const handleSearchSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await executeSearch();
      setLastSearchTerm(searchQuery.trim());
      setIsSearchActive(true);
    },
    [executeSearch, searchQuery],
  );

  const renderSearchModal = () => {
    if (!isSearchActive) return null;
    return (
      <div
        className="fixed inset-0 z-[120] flex items-start justify-center px-4 md:px-8 pt-24 pb-10"
        role="dialog"
        aria-modal="true"
        aria-label="Search vendors"
      >
        <div
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          onClick={() => setIsSearchActive(false)}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
          <div className="relative overflow-hidden rounded-[32px] bg-white shadow-[0_45px_120px_rgba(0,0,0,0.18)] ring-1 ring-n-3/20">
            <div
              className="absolute inset-x-10 top-4 h-16 rounded-[32px] bg-gradient-to-r from-primary-3/10 via-primary-4/10 to-primary-3/10 blur-3xl opacity-60 pointer-events-none"
              aria-hidden
            />

            <form
              onSubmit={handleSearchSubmit}
              className="relative"
              role="search"
            >
              <div className="p-6 md:p-8 space-y-6">
                <div className="relative flex items-center gap-3 rounded-[28px] bg-n-2/50 border border-transparent px-5 py-3 focus-within:bg-white focus-within:border-primary-3 focus-within:ring-4 focus-within:ring-primary-3/10 transition-all">
                  <Search className="text-primary-4" size={20} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors, products..."
                    aria-label="Search vendors and products"
                    className="flex-1 bg-transparent text-base md:text-lg text-n-8 placeholder:text-n-4/70 outline-none"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSearchAction(true)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-primary-3 text-white shadow-md shadow-primary-3/30 hover:bg-primary-4 transition-colors"
                      aria-label="Search and close"
                    >
                      <Search size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSearchActive(false)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-n-3/20 text-n-5 hover:bg-white"
                      aria-label="Close search"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-n-5">
                  Quick tip: press
                  <span className="px-2 py-0.5 border border-n-3/30 rounded text-[11px] bg-n-2/10 ml-1">
                    ⌘ / Ctrl
                  </span>
                  +
                  <span className="px-2 py-0.5 border border-n-3/30 rounded text-[11px] bg-n-2/10 ml-1">
                    K
                  </span>
                  anywhere to open search
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2" ref={schoolDropdownRef}>
                    <label className="text-xs font-bold text-n-4 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <School size={14} /> School
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedSchool}
                        onChange={(e) => {
                          setSelectedSchool(e.target.value);
                          setShowSchoolDropdown(true);
                          updateDropdownStyle(
                            schoolDropdownRef,
                            setSchoolDropdownStyle,
                          );
                        }}
                        onFocus={() => {
                          setShowSchoolDropdown(true);
                          updateDropdownStyle(
                            schoolDropdownRef,
                            setSchoolDropdownStyle,
                          );
                        }}
                        placeholder="All Schools"
                        className="w-full h-12 px-4 pr-10 rounded-2xl bg-n-2/40 border border-transparent outline-none text-sm md:text-base text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/15 transition-all cursor-pointer"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
                        {loadingSchools ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${showSchoolDropdown ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>

                      {showSchoolDropdown && (
                        <div
                          ref={schoolDropdownListRef}
                          className="fixed z-[130] bg-white rounded-2xl shadow-xl border border-n-3/20 max-h-60 overflow-y-auto py-2"
                          style={{
                            top: schoolDropdownStyle?.top,
                            left: schoolDropdownStyle?.left,
                            width: schoolDropdownStyle?.width,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSchool("");
                              setShowSchoolDropdown(false);
                              setSchoolDropdownStyle(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium">All Schools</span>
                            {selectedSchool === "" && (
                              <Check className="w-4 h-4 text-primary-3" />
                            )}
                          </button>

                          {authUser?.schoolName && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSchool(authUser.schoolName);
                                setShowSchoolDropdown(false);
                                setSchoolDropdownStyle(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between border-t border-b border-n-3/10"
                            >
                              <span className="font-medium">
                                My School ({authUser.schoolName})
                              </span>
                              {selectedSchool === authUser.schoolName && (
                                <Check className="w-4 h-4 text-primary-3" />
                              )}
                            </button>
                          )}

                          {schools
                            .filter((s) => {
                              const term = selectedSchool.toLowerCase();
                              const matchesSearch = s
                                .toLowerCase()
                                .includes(term);
                              const isNotMySchool = s !== authUser?.schoolName;
                              return matchesSearch && isNotMySchool;
                            })
                            .map((school, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setSelectedSchool(school);
                                  setShowSchoolDropdown(false);
                                  setSelectedLocation("");
                                  setSchoolDropdownStyle(null);
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

                  <div className="space-y-2" ref={locationDropdownRef}>
                    z
                    <label className="text-xs font-bold text-n-4 uppercase tracking-widest flex items-center gap-2 ml-1">
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
                          updateDropdownStyle(
                            locationDropdownRef,
                            setLocationDropdownStyle,
                          );
                        }}
                        onFocus={() => {
                          setShowLocationDropdown(true);
                          updateDropdownStyle(
                            locationDropdownRef,
                            setLocationDropdownStyle,
                          );
                        }}
                        disabled={!selectedSchool}
                        className={`w-full h-12 px-4 pr-10 rounded-2xl bg-n-2/40 border border-transparent outline-none text-sm md:text-base text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/15 transition-all ${
                          !selectedSchool ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
                        {loadingAreas ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>

                      {showLocationDropdown && selectedSchool && (
                        <div
                          ref={locationDropdownListRef}
                          className="fixed z-[130] bg-white rounded-2xl shadow-xl border border-n-3/20 max-h-60 overflow-y-auto py-2"
                          style={{
                            top: locationDropdownStyle?.top,
                            left: locationDropdownStyle?.left,
                            width: locationDropdownStyle?.width,
                          }}
                        >
                          {areaSuggestions.length > 0 ? (
                            areaSuggestions.map((area, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setSelectedLocation(area);
                                  setShowLocationDropdown(false);
                                  setLocationDropdownStyle(null);
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
            </form>
          </div>
        </div>
      </div>
    );
  };

  const featuredHeading = lastSearchTerm
    ? `Result for "${lastSearchTerm}"`
    : "Featured Products";

  return (
    <Fragment>
      {renderSearchModal()}
      <div className="bg-n-1 min-h-screen pb-5 md:pb-0">
        <HomeContent />
        <div className="pb-12">
          <NewArrival />
          <TopSellers />
          <Trending />
          <div ref={featuredSectionRef}>
            <NearByVendors
              products={featuredProducts}
              loading={isFetchingFeaturedProducts}
              title={featuredHeading}
              searchTerm={lastSearchTerm}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
