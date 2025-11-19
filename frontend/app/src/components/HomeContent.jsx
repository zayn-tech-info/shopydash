import { BookOpen, Headset, Search, SearchIcon, Shirt } from "lucide-react";
import { categories } from "../constants";

export function HomeContent({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products, vendor…",
  className = "",
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  }

  return (
    <section className="pt-8 pb-6 px-4 md:px-8 bg-white border-b border-n-3/10 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="h4 text-n-8">
              Hi <span className="text-primary-3">User👋</span>
            </h1>
            <p className="body-2 text-n-4 mt-1">
              Ready to shop or sell something today?
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`w-full md:max-w-md relative ${className}`}
            role="search"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-n-4 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-label="text"
                className="w-full h-12 pl-12 pr-14 rounded-xl bg-n-2/20 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-3 text-white rounded-lg hover:bg-primary-4 transition-colors shadow-md shadow-primary-3/20"
              >
                <SearchIcon size={18} />
              </button>
            </div>
          </form>
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
  );
}
