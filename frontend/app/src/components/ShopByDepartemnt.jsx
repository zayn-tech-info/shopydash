import { categories } from "../constants";

export function ShopByDepartemnt() {
  if (!Array.isArray(categories) || categories.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 className="text-sm sm:text-xl md:text-lg font-semibold text-gray-900">
            Shop by Department
          </h2>
          <span className="text-sm text-gray-500">
            Browse popular categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                className="group rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                    {Icon ? <Icon size={20} className="sm:h-6 sm:w-6" /> : null}
                  </div>
                  <span className="font-medium text-gray-900 truncate">
                    {cat.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
