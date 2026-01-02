/* import { Quote } from "lucide-react";

const testimonials = [
  {
    id: "t-1",
    name: "Bisi",
    school: "LAUTECH",
    quote: "Shopydash helped me sell my sneakers in less than 24 hours!",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "t-2",
    name: "Tobi",
    school: "UI",
    quote: "List, chat, and done. Super easy for campus sales.",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: "t-3",
    name: "Ada",
    school: "UNN",
    quote:
      "I sold my old textbooks to juniors and saved money for the semester.",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: "t-4",
    name: "Ibrahim",
    school: "LASU",
    quote: "Great way to find legit sellers on campus—fast and safe.",
    avatar: "https://i.pravatar.cc/80?img=18",
  },
];

export function Testimonial() {
  if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 mb-12 relative z-0">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="h4 text-n-8">Client Testimonials</h2>
          <p className="body-2 text-n-4 mt-1">
            Real stories from campus sellers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border border-n-3/10 bg-white p-6 md:hover:shadow-xl md:hover:shadow-n-3/10 transition-all duration-300 md:hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={t.avatar}
                alt={`${t.name} avatar`}
                className="h-12 w-12 rounded-full object-cover border-2 border-n-1 shadow-sm"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="truncate font-bold text-n-8">{t.name}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-3">
                  {t.school}
                </p>
              </div>
            </div>

            <div className="relative">
              <Quote
                size={24}
                className="absolute -top-2 -left-2 text-n-2/50"
              />
              <p className="text-n-6 leading-relaxed relative z-10 pl-4 italic">
                "{t.quote}"
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
 */