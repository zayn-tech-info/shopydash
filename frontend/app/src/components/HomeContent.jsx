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

  const [selectedSchool, setSelectedSchool] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);
  const schoolDropdownRef = useRef(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    } else {
      const params = new URLSearchParams();
      if (value) params.append("search", value);
      if (selectedSchool) params.append("school", selectedSchool);
      if (selectedLocation) params.append("area", selectedLocation);

      navigate(`/feeds?${params.toString()}`);
    }
  }

  return (
    <>
      {}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-n-8/20 md:backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setIsSearchActive(false)}
        />
      )}

      <section className="py-4 -ml-2 md:-ml-0 md:py-6 md:px-6 bg-white border-b border-n-3/10 shadow-sm relative">
        <div className="container mx-auto max-w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-4 relative">
            <div>
              {authUser ? (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-n-8">
                    Hi{" "}
                    <span className="text-primary-3 break-all">
                      {authUser.username}👋
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-n-5 mt-1">
                    Ready to shop or sell something today?
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-n-8">
                    Welcome to <span className="text-primary-3">Shopydash</span>
                  </h1>
                  <p className="text-sm md:text-base text-n-5 mt-1">
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


          </div>

          {/* Categories Section */}
          <div className="relative mt-6 md:mt-8 mb-4">
            {/* Fade indicators for scroll hint */}
            <div
              className="pointer-events-none select-none absolute left-0 top-0 h-full w-10 z-5 block md:hidden"
              style={{
                background: "linear-gradient(to right, #fff 70%, transparent)",
              }}
            />
            <div
              className="pointer-events-none select-none absolute right-0 top-0 h-full w-10 z-5 block md:hidden"
              style={{
                background: "linear-gradient(to left, #fff 70%, transparent)",
              }}
            />
            <button
              type="button"
              aria-label="Scroll categories left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white/90 via-white/70 to-transparent hover:from-primary-3/90 hover:via-primary-3/80 hover:to-primary-3/60 text-primary-3 hover:text-white shadow-lg rounded-full p-2 transition-all duration-200 flex"
              style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
              onClick={() => {
                document
                  .getElementById("category-scroll")
                  .scrollBy({ left: -200, behavior: "smooth" });
              }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              id="category-scroll"
              className="w-full flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:justify-between md:flex-nowrap scroll-smooth"
            >
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={`/feeds?category=${encodeURIComponent(item.text)}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="flex flex-col items-center gap-2 md:gap-2.5">
                      <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full bg-n-2/40 group-hover:bg-primary-3/10 flex items-center justify-center text-n-6 group-hover:text-primary-3 transition-all duration-200 border border-n-3/20 group-hover:border-primary-3/30 shadow-sm">
                        {Icon && (
                          <Icon
                            size={22}
                            className="md:w-6 md:h-6"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-n-6 group-hover:text-primary-3 transition-colors whitespace-nowrap">
                        {item.text}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Scroll categories right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white/90 via-white/70 to-transparent hover:from-primary-3/90 hover:via-primary-3/80 hover:to-primary-3/60 text-primary-3 hover:text-white shadow-lg rounded-full p-2 transition-all duration-200 flex"
              style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
              onClick={() => {
                document
                  .getElementById("category-scroll")
                  .scrollBy({ left: 200, behavior: "smooth" });
              }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
