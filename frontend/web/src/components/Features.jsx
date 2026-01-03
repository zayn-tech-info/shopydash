import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
  Search,
} from "lucide-react";

export function Features() {
  return (
    <div>
      <section id="features" className="bg-n-1 py-24 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] bg-orange-50/50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              Why Shopydash?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-n-8 mb-6 font-sora tracking-tight">
              Everything you need to{" "}
              <span className="text-orange-500">dominate</span> campus commerce
            </h2>
            <p className="text-xl text-n-4 leading-relaxed">
              We've built the ultimate platform for students to buy, sell, and
              connect securely within their university community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-n-2/30 hover:border-orange-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-n-8 mb-3 font-sora">
                  {feature.title}
                </h3>
                <p className="text-n-4 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Store,
    title: "Student Vendor Profiles",
    description:
      "Create your shop profile to showcase products, build your campus brand, and reach thousands of students.",
  },
  {
    icon: Search,
    title: "Smart Product Search",
    description:
      "Easily find exactly what you need. Browse by category, price, or location to discover items around campus.",
  },
  {
    icon: ShoppingBag,
    title: "Easy Campus Shopping",
    description:
      "Buy textbooks, gadgets, food, fashion, and more from verified students with secure checkout options.",
  },
  {
    icon: TrendingUp,
    title: "Seamless Payouts",
    description:
      "Track your sales and withdraw your earnings directly to your bank account via our secure Paystack integration.",
  },
  {
    icon: Shield,
    title: "Safe Transactions",
    description:
      "Verified student accounts and secure payments ensure safe buying and selling within your community.",
  },
  {
    icon: MessageCircle,
    title: "Instant Messaging",
    description:
      "Chat directly with vendors to ask questions, negotiate prices, and arrange safe meetups on campus.",
  },
];
