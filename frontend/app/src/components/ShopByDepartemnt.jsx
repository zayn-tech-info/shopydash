import { categories } from "../constants";

export function ShopByDepartemnt() {
  if (!Array.isArray(categories) || categories.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="h4 text-n-8">Shop by Department</h2>
          <p className="body-2 text-n-4 mt-1">Browse popular categories</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              className="group rounded-2xl border border-n-3/10 bg-white p-4 hover:shadow-xl hover:shadow-n-3/10 transition-all duration-300 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-n-2/20 text-n-6 group-hover:bg-primary-3 group-hover:text-white transition-colors duration-300">
                  {Icon ? <Icon size={20} /> : null}
                </div>
                <span className="font-bold text-n-8 group-hover:text-primary-3 transition-colors truncate">
                  {cat.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
