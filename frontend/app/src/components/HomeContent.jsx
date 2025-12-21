import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SearchIcon,
  MapPin,
  School,
  X,
  ChevronDown,
  Check,
  Loader,
} from "lucide-react";
import { categories } from "../constants";
import { useAuthStore } from "../store/authStore";
import { api } from "../lib/axios";

export function HomeContent({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products, vendor…",
  className = "",
}) {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef(null);

  // School Selection State
  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // Location/Area Selection State
  const [selectedLocation, setSelectedLocation] = useState("");
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);
  const schoolDropdownRef = useRef(null);

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

  // Fetch Areas
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

  // Handle Click Outside
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

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    } else {
      // Navigate to feeds with query params if no external onSubmit is provided
      const params = new URLSearchParams();
      if (value) params.append("search", value);
      if (selectedSchool) params.append("school", selectedSchool);
      if (selectedLocation) params.append("area", selectedLocation);

      navigate(`/feeds?${params.toString()}`);
    }
  }

  return (
    <>
      {/* Search Overlay Background */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-n-8/20 md:backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setIsSearchActive(false)}
        />
      )}

      <section className="pt-8 pb-6 px-4 md:px-8 bg-white border-b border-n-3/10 shadow-sm relative">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
            <div>
              {authUser ? (
                <>
                  <h1 className="h4 text-n-8">
                    Hi{" "}
                    <span className="text-primary-3 break-all">
                      {authUser.username}👋
                    </span>
                  </h1>
                  <p className="body-2 text-n-4 mt-1">
                    Ready to shop or sell something today?
                  </p>
                </>
              ) : (
                <>
                  <h1 className="h4 text-n-8">
                    Welcome to <span className="text-primary-3">Vendora</span>
                  </h1>
                  <p className="body-2 text-n-4 mt-1">
                    <Link
                      to="/signup"
                      className="text-primary-3 font-bold hover:underline"
                    >
                      Sign up
                    </Link>{" "}
                    to start shopping or selling today.
                  </p>
                </>
              )}
            </div>

            <div
              className={`w-full md:max-w-md transition-all duration-300 ${
                isSearchActive ? "z-50 relative" : "relative"
              }`}
            >
              <div
                className={`bg-white transition-all duration-300 ease-out ${
                  isSearchActive
                    ? "rounded-2xl shadow-2xl ring-1 ring-n-3/10"
                    : "rounded-xl"
                }`}
              >
                <form
                  onSubmit={handleSubmit}
                  className="relative"
                  role="search"
                >
                  <div
                    className={`relative transition-all duration-300 ${
                      isSearchActive ? "p-3" : ""
                    }`}
                  >
                    {/* Input Wrapper */}
                    <div className="relative group">
                      <Search
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                          isSearchActive
                            ? "text-n-4"
                            : "text-n-4 group-hover:text-primary-3"
                        }`}
                        size={20}
                      />

                      <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsSearchActive(true)}
                        placeholder={placeholder}
                        aria-label="text"
                        className={`w-full h-12 bg-n-2/30 border border-transparent outline-none text-n-8 placeholder:text-n-4/60 transition-all duration-300 ${
                          isSearchActive
                            ? "rounded-xl pl-12 pr-10 focus:bg-n-2/50"
                            : "rounded-xl pl-12 pr-14 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10"
                        }`}
                      />

                      {/* Right Actions */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {isSearchActive ? (
                          <button
                            type="button"
                            onClick={() => setIsSearchActive(false)}
                            className="p-2 hover:bg-n-3/20 rounded-full text-n-4 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="p-2 bg-primary-3 text-white rounded-lg hover:bg-primary-4 transition-all shadow-md shadow-primary-3/20 hover:shadow-lg hover:shadow-primary-3/30"
                          >
                            <SearchIcon size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Filters */}
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-in-out overflow-hidden ${
                        isSearchActive
                          ? "max-h-60 opacity-100 mt-4 px-1 pb-1 overflow-visible"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      {/* School Filter */}
                      <div
                        className="space-y-2 relative"
                        ref={schoolDropdownRef}
                      >
                        <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2 ml-1">
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
                            className="w-full h-11 px-4 pr-10 rounded-xl bg-n-2/30 border border-transparent outline-none text-sm text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all cursor-pointer"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
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
                      <div
                        className="space-y-2 relative"
                        ref={locationDropdownRef}
                      >
                        <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2 ml-1">
                          <MapPin size={14} /> Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={
                              selectedSchool
                                ? `Filter by location around...`
                                : "Select a school first"
                            }
                            value={selectedLocation}
                            onChange={(e) => {
                              setSelectedLocation(e.target.value);
                              setShowLocationDropdown(true);
                            }}
                            onFocus={() => setShowLocationDropdown(true)}
                            disabled={!selectedSchool}
                            className={`w-full h-11 px-4 pr-10 rounded-xl bg-n-2/30 border border-transparent outline-none text-sm text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all ${
                              !selectedSchool
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4">
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
                </form>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full flex gap-6 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:justify-between">
              {categories.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="flex-shrink-0 group cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-n-2/20 group-hover:bg-primary-3/10 flex items-center justify-center text-n-6 group-hover:text-primary-3 transition-all duration-300 border border-transparent group-hover:border-primary-3/20">
                        {Icon && <Icon size={24} />}
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-n-5 group-hover:text-n-8 transition-colors">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
