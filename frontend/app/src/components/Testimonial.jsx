import { Quote } from "lucide-react";

const testimonials = [
  {
    id: "t-1",
    name: "Bisi",
    school: "UNILAG",
    quote: "Vendora helped me sell my sneakers in less than 24 hours!",
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
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Client Testimonials
          </h2>
          <span className="text-sm text-gray-500">
            Real stories from campus sellers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={`${t.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.school}</p>
                </div>
              </div>

              <div className="mt-4 text-gray-700 leading-relaxed">
                <Quote size={18} className="inline mr-1 text-gray-400" />
                <span className="align-middle">{t.quote}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
