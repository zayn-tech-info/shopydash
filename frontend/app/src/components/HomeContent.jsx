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
    <section>
      <div className="text-base font-medium my-2 md:my-4 lg:my-5 md:text-2xl lg:text-lg bg-primary-2 text-white md:w-72 p-2 rounded-md">
        <p>
          Hi <span className="font-bold">User👋</span>
        </p>
        <p className="text-sm text-n-1/90">
          Ready to shop or sell something today?
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className={`w-full ${className} px-6 my-6 text-sm flex justify-center`}
        role="search"
      >
        <div className="relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-n-4 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label="text"
            className="w-full text-base h-11 md:h-12 pl-10 pr-28 rounded-lg bg-n-1 text-n-9 placeholder-n-4 border border-stroke-1 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 shadow-sm"
          />
          <div className="absolute right-2 top-1/3 -translate-y-1/2 text-n-1  bg-primary-3 px-1 rounded-md md:px-5 mt-2 h-9 md:h-10  cursor-pointer">
            <SearchIcon className="md:absolute md:top-1 right-1 " size={30} />
          </div>
        </div>
      </form>
 
      <div>
        <div className="flex gap-4 md:gap-10 lg:gap-16 overflow-x-auto no-scrollbar px-4 py-3 justify-center">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id}>
                <div className="flex flex-col items-center min-w-[80px] cursor-pointer">
                  <div className="bg-orange-100 p-4 rounded-full text-orange-500 text-2xl">
                    {Icon && <Icon />}
                  </div>
                  <p className="text-sm mt-2">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
