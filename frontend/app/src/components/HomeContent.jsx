import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Headset,
  Search,
  SearchIcon,
  Shirt,
  MapPin,
  School,
  X,
  ChevronDown,
} from "lucide-react";
import { categories, schools } from "../constants";
import { useAuthStore } from "../store/authStore";

export function HomeContent({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products, vendor…",
  className = "",
}) {
  const { authUser } = useAuthStore();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  }

  return (
    <>
      {/* Search Overlay Background */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-n-8/20 backdrop-blur-sm z-40 transition-all duration-500"
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
                    <span className="text-primary-3">
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
                          ? "max-h-60 opacity-100 mt-4 px-1 pb-1"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2 ml-1">
                          <School size={14} /> School
                        </label>
                        <div className="relative">
                          <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-n-2/30 border border-transparent outline-none text-sm text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="">All Schools</option>
                            {schools.map((school, index) => (
                              <option key={index} value={school}>
                                {school}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-n-4"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-n-4 uppercase tracking-wider flex items-center gap-2 ml-1">
                          <MapPin size={14} /> Location
                        </label>
                        <input
                          type="text"
                          placeholder="Filter by location..."
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-n-2/30 border border-transparent outline-none text-sm text-n-8 focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all"
                        />
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
