import {
  Store,
  ShoppingBag,
  TrendingUp,
  Shield,
  MessageCircle,
  Search,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Store,
    tag: "For Sellers",
    title: "Student Vendor Profiles",
    description:
      "Set up your campus shop in minutes. Showcase your products, build your brand, and reach thousands of verified students at your university.",
    accent: "orange",
    size: "large",
  },
  {
    icon: Search,
    tag: "Discovery",
    title: "Smart Campus Search",
    description:
      "Find exactly what you need. Browse by category, price, or location — surfaced only to students inside your university.",
    accent: "amber",
    size: "small",
  },
  {
    icon: ShoppingBag,
    tag: "For Buyers",
    title: "Easy Campus Shopping",
    description:
      "Buy textbooks, gadgets, food, fashion, and more from verified students with secure checkout options.",
    accent: "orange",
    size: "small",
  },
  {
    icon: TrendingUp,
    tag: "Earnings",
    title: "Seamless Payouts",
    description:
      "Track your sales and withdraw your earnings directly to your bank account via our secure Paystack integration.",
    accent: "emerald",
    size: "small",
  },
  {
    icon: Shield,
    tag: "Trust & Safety",
    title: "Safe Transactions",
    description:
      "Verified student accounts and secure payments ensure safe buying and selling within your campus community.",
    accent: "blue",
    size: "small",
  },
  {
    icon: MessageCircle,
    tag: "Communication",
    title: "Instant Messaging",
    description:
      "Chat directly with vendors to ask questions, discuss products, and coordinate orders — all within the app.",
    accent: "orange",
    size: "large",
  },
];

const accentMap = {
  orange: {
    badge: "bg-orange-50 text-orange-600 border-orange-100",
    icon: "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
    dot: "bg-orange-400",
    border: "hover:border-orange-200",
    glow: "from-orange-100/60",
  },
  amber: {
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    icon: "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
    dot: "bg-amber-400",
    border: "hover:border-amber-200",
    glow: "from-amber-100/60",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
    dot: "bg-emerald-400",
    border: "hover:border-emerald-200",
    glow: "from-emerald-100/60",
  },
  blue: {
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    icon: "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
    dot: "bg-blue-400",
    border: "hover:border-blue-200",
    glow: "from-blue-100/60",
  },
};

function FeatureCard({ feature }) {
  const accent = accentMap[feature.accent];
  const isLarge = feature.size === "large";

  return (
    <div
      className={`group relative bg-white rounded-3xl border border-n-2/30 ${accent.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col ${
        isLarge ? "md:col-span-2 lg:col-span-1" : ""
      }`}
    >
      {/* Subtle gradient glow top-left */}
      <div
        className={`absolute top-0 left-0 w-48 h-48 bg-gradient-to-br ${accent.glow} to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
      />

      <div className="relative z-10 p-7 flex flex-col flex-1">
        {/* Tag + Icon row */}
        <div className="flex items-center justify-between mb-5">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${accent.badge}`}
          >
            {feature.tag}
          </span>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${accent.icon}`}
          >
            <feature.icon className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-n-8 font-sora mb-2 leading-snug">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-n-4 leading-relaxed flex-1">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-n-1 py-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[15%] -right-[8%] w-[600px] h-[600px] bg-orange-50/70 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-[5%] -left-[8%] w-[450px] h-[450px] bg-blue-50/60 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] bg-amber-50/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            Why Shopydash?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-n-8 mb-5 font-sora tracking-tight leading-tight">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              dominate
            </span>{" "}
            campus commerce
          </h2>
          <p className="text-lg text-n-4 leading-relaxed">
            We've built the ultimate platform for students to buy, sell, and connect
            securely within their university community.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: "2k+", label: "Active Students" },
            { value: "5+", label: "Nigerian Campuses" },
            { value: "60s", label: "To Go Live" },
            { value: "100%", label: "Campus-Verified" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-n-2/30 px-5 py-4 text-center shadow-sm"
            >
              <p className="text-2xl font-extrabold text-n-8 font-sora">{stat.value}</p>
              <p className="text-xs text-n-4 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-n-8/95 via-n-7/90 to-n-8/95 px-6 sm:px-10 md:px-16 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10 backdrop-blur-lg">
          <div className="w-full md:w-auto">
            <p className="text-white font-extrabold text-2xl md:text-3xl font-sora mb-3 drop-shadow-sm">
              Ready to start your campus hustle?
            </p>
            <p className="text-gray-300 text-base md:text-lg mb-2 md:mb-0">
              Join thousands of students already buying and selling on Shopydash.
            </p>
          </div>
          <a
            href="https://app.shopydash.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
