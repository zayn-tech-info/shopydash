import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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
  const schoolDropdownListRef = useRef(null);
  const locationDropdownListRef = useRef(null);
  const searchInputRef = useRef(null);
  const fetchProductsRef = useRef(() => {});
  const filtersRef = useRef({
    school: selectedSchool,
    location: selectedLocation,
    initialized: false,
  });
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [schoolDropdownStyle, setSchoolDropdownStyle] = useState(null);
  const [locationDropdownStyle, setLocationDropdownStyle] = useState(null);

  useLayoutEffect(() => {
    if (!showTutorial) return;
    if (typeof window === "undefined") return;
    const getTriggerElement = () => {
      const candidates = document.querySelectorAll(
        "[data-feeds-search-trigger]",
      );
      for (const el of candidates) {
        if (el instanceof HTMLElement && el.offsetParent !== null) {
          return el;
        }
      }
      return candidates[0] || null;
    };

    const updateAnchor = () => {
      const el = getTriggerElement();
      if (el) {
        const rect = el.getBoundingClientRect();
        setTooltipAnchor({
          bottom: window.innerHeight - rect.top + 12,
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
    if (!isSearchActive) return;
    const inputEl = searchInputRef.current;
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  }, [isSearchActive]);

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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const trimmedSearch = searchQuery.trim();
      const params = {};
      if (selectedSchool) params.school = selectedSchool;
      if (selectedLocation) params.area = selectedLocation;
      const category = searchParams.get("category");
      if (category) params.category = category;

      let products = [];
      if (trimmedSearch) {
        const { category: _ignoredCategory, ...searchParamsPayload } = params;
        const res = await api.get("/api/v1/post/search", {
          params: {
            ...searchParamsPayload,
            search: trimmedSearch,
            limit: 100,
          },
        });
        products = res.data?.data?.products ?? [];
      } else {
        const res = await api.post(
          "/api/v1/post/feed/products/random",
          { limit: 100 },
          { params },
        );
        products = res.data?.data?.products ?? [];
      }

      setFeedProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error(error);
      setFeedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSchool, selectedLocation, searchQuery, searchParams]);

  useEffect(() => {
    fetchProductsRef.current = fetchProducts;
  }, [fetchProducts]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      fetchProductsRef.current && fetchProductsRef.current();
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProductsRef.current && fetchProductsRef.current();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const prev = filtersRef.current;
    const hasChanged =
      prev.school !== selectedSchool ||
      prev.location !== selectedLocation ||
      !prev.initialized;

    if (!hasChanged) return;

    filtersRef.current = {
      school: selectedSchool,
      location: selectedLocation,
      initialized: true,
    };

    fetchProductsRef.current && fetchProductsRef.current();
  }, [selectedSchool, selectedLocation]);

  const dismissTutorial = () => {
    localStorage.setItem(FEEDS_TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  const executeSearch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      executeSearch();
      setIsSearchActive(true);
    },
    [executeSearch],
  );

  return (
    <div className="relative min-h-screen pb-32">
      {showTutorial && (
        <div
          className="fixed inset-0 z-[100] animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feeds-tutorial-title"
        >
          <div
            className="absolute inset-0 bg-black/45"
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
                    bottom: "6rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
            }
          >
            <div className="bg-white rounded-xl shadow-xl border border-n-3/10 p-4">
              <p id="feeds-tutorial-title" className="text-sm text-n-7 mb-3">
                Use the navbar search or press Ctrl / Cmd + K to filter any
                time.
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
              <div className="absolute inset-x-10 top-4 h-16 rounded-[32px] bg-gradient-to-r from-primary-3/10 via-primary-4/10 to-primary-3/10 blur-3xl opacity-60 pointer-events-none" aria-hidden />

              <form onSubmit={handleSearchSubmit} className="relative" role="search">
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
                        onClick={() => {
                          executeSearch();
                          setIsSearchActive(false);
                          searchInputRef.current?.blur();
                        }}
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
                    Quick tip: press <span className="px-2 py-0.5 border border-n-3/30 rounded text-[11px] bg-n-2/10">⌘ / Ctrl</span>
                    +<span className="px-2 py-0.5 border border-n-3/30 rounded text-[11px] bg-n-2/10">K</span> anywhere to open search
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
                            updateDropdownStyle(schoolDropdownRef, setSchoolDropdownStyle);
                          }}
                          onFocus={() => {
                            setShowSchoolDropdown(true);
                            updateDropdownStyle(schoolDropdownRef, setSchoolDropdownStyle);
                          }}
                          placeholder="All Schools"
                          className="w-full h-12 px-4 pr-10 rounded-2xl bg-n-2/40 border border-transparent outline-none text-sm md:text-base text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/15 transition-all cursor-pointer"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
                          {loadingSchools ? (
                            <Loader className="animate-spin w-4 h-4" />
                          ) : (
                            <ChevronDown className={`w-4 h-4 transition-transform ${showSchoolDropdown ? "rotate-180" : ""}`} />
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
                              {selectedSchool === "" && <Check className="w-4 h-4 text-primary-3" />}
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
                                <span className="font-medium">My School ({authUser.schoolName})</span>
                                {selectedSchool === authUser.schoolName && <Check className="w-4 h-4 text-primary-3" />}
                              </button>
                            )}

                            {schools
                              .filter((s) => {
                                const term = selectedSchool.toLowerCase();
                                const matchesSearch = s.toLowerCase().includes(term);
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
                                  {selectedSchool === school && <Check className="w-4 h-4 text-primary-3" />}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2" ref={locationDropdownRef}>
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
                            updateDropdownStyle(locationDropdownRef, setLocationDropdownStyle);
                          }}
                          onFocus={() => {
                            setShowLocationDropdown(true);
                            updateDropdownStyle(locationDropdownRef, setLocationDropdownStyle);
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
                            <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
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
                                  {selectedLocation === area && <Check className="w-4 h-4 text-primary-3" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-n-4">No areas found</div>
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
      )}

      <div className="pt-10">
        <NearByVendors
          products={feedProducts}
          showHeader={false}
          loading={loading}
        />
      </div>
    </div>
  );
}
