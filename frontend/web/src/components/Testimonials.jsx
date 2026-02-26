export function Testimonials() {
  const testimonials = [
    {
      name: "Tolu, 300L — UNILAG",
      role: "Campus thrift seller",
      quote:
        "Before ShopyDash, I was posting on random WhatsApp groups. Now my hostel essentials sell out every week.",
    },
    {
      name: "Zaynab, 200L — LAUTECH",
      role: "Tech student & buyer",
      quote:
        "I’ve bought textbooks, a used laptop, and even food packs from trusted students on my campus. It just feels safer.",
    },
    {
      name: "Kelechi, 400L — UNN",
      role: "Gadget reseller",
      quote:
        "The verified students and in‑app conversations make it easy to close deals quickly without stress.",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-24" id="stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
            Social proof
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-n-8 font-sora tracking-tight">
            Students are already cashing out on ShopyDash
          </h2>
          <p className="mt-4 text-base md:text-lg text-n-4">
            Built specifically for Nigerian universities, ShopyDash makes it
            easy to turn unused items into steady campus income.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="relative h-full rounded-3xl bg-gradient-to-b from-orange-50/60 via-white to-white border border-orange-100/60 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 md:p-7 flex flex-col"
            >
              <div className="mb-4 text-4xl leading-none">“</div>
              <blockquote className="text-sm md:text-base text-n-6 leading-relaxed flex-1">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-n-8 text-sm md:text-base">
                  {item.name}
                </p>
                <p className="text-xs md:text-sm text-n-4 mt-1">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

