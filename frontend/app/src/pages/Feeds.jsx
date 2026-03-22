import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
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
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const FEEDS_TUTORIAL_KEY = "feeds_school_filter_tutorial_seen";

export default function Feeds() {
  const [searchParams] = useSearchParams();
  const { authUser } = useAuthStore();
  const [feedProducts, setFeedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(FEEDS_TUTORIAL_KEY);
  });

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const [selectedSchool, setSelectedSchool] = useState(
    searchParams.get("school") || "",
  );

  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("area") || "",
  );
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [isSearchActive, setIsSearchActive] = useState(false);

  const schoolDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const schoolFilterChipRef = useRef(null);
  const [tooltipAnchor, setTooltipAnchor] = useState(null);

  useLayoutEffect(() => {
    if (!showTutorial) return;
    const updateAnchor = () => {
      const el = schoolFilterChipRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setTooltipAnchor({
          bottom: window.innerHeight - rect.top + 8,
          left: rect.left + rect.width / 2,
        });
        return true;
      }
      return false;
    };
    updateAnchor();
    const t1 = setTimeout(updateAnchor, 50);
    const t2 = setTimeout(updateAnchor, 150);
    const t3 = setTimeout(updateAnchor, 400);
    window.addEventListener("resize", updateAnchor);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateAnchor);
    };
  }, [showTutorial]);

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

    const delayDebounceFn = setTimeout(() => {
      fetchAreas();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedLocation, selectedSchool]);

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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSchool) params.school = selectedSchool;
      if (selectedLocation) params.area = selectedLocation;
      if (searchQuery) params.search = searchQuery;
      const category = searchParams.get("category");
      if (category) params.category = category;

      const res = await api.post("/api/v1/post/feed/products/random", { limit: 100 }, { params });
      const products = res.data?.data?.products ?? [];
      setFeedProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error(error);
      setFeedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSchool, selectedLocation, searchQuery, searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts, searchQuery]);

  useEffect(() => {
    if (!searchQuery) fetchProducts();
  }, [selectedSchool, selectedLocation]);

  const dismissTutorial = () => {
    localStorage.setItem(FEEDS_TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* First-time tutorial: dimmed overlay + tooltip on filter chip */}
      {showTutorial && (
        <div
          className="fixed inset-0 z-[100] animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feeds-tutorial-title"
        >
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={dismissTutorial}
            aria-hidden
          />
          <div
            className="absolute z-10 w-[calc(100%-2rem)] max-w-xs animate-in fade-in zoom-in-95 duration-200"
            style={
              tooltipAnchor
                ? {
                    bottom: tooltipAnchor.bottom,
                    left: tooltipAnchor.left,
                    transform: "translateX(-50%)",
                  }
                : {
                    bottom: "40%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
            }
          >
              <div className="bg-white rounded-xl shadow-xl border border-n-3/10 p-4">
                <p
                  id="feeds-tutorial-title"
                  className="text-sm text-n-7 mb-3"
                >
                  Tap here to filter by your school or browse all.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissTutorial();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-primary-3 text-white font-semibold text-xs hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-3 focus:ring-offset-2"
                >
                  Got it
                </button>
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white border-r border-b border-n-3/10 rotate-45"
                aria-hidden
              />
            </div>
        </div>
      )}

      {isSearchActive && (
        <div
          className="fixed inset-0 bg-black/20 md:backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSearchActive(false)}
        />
      )}

      {}
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
              <div
                className="flex items-center gap-2 bg-n-2/30 rounded-xl px-4 py-2 cursor-pointer"
                onClick={() => !isSearchActive && setIsSearchActive(true)}
              >
                <Search className="text-n-4" size={20} />
                <input
                  type="text"
                  placeholder="Search vendors, products..."
                  className="flex-1 bg-transparent border-none outline-none text-n-8 placeholder:text-n-4 h-10 min-w-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                />

                {!isSearchActive && (
                  <div
                    ref={schoolFilterChipRef}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-lg border border-n-3/10 shadow-sm"
                  >
                    <School size={12} className="text-primary-3" />
                    <span className="text-xs font-bold text-n-6 whitespace-nowrap max-w-[80px] sm:max-w-xs truncate">
                      {selectedSchool || "All Schools"}
                    </span>
                  </div>
                )}

                {isSearchActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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

              {}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 px-4 transition-all duration-300 overflow-hidden ${
                  isSearchActive
                    ? "max-h-40 mt-4 pb-4 opacity-100 overflow-visible"
                    : "max-h-0 opacity-0"
                }`}
              >
                {}
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

                        {authUser?.schoolName && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSchool(authUser.schoolName);
                              setShowSchoolDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between border-b border-n-3/10"
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
                            const matchesSearch = s
                              .toLowerCase()
                              .includes(selectedSchool.toLowerCase());
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

                {}
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

      <div className="pb-20">
        <NearByVendors
          products={feedProducts}
          showHeader={false}
          loading={loading}
        />
      </div>
    </div>
  );
}
