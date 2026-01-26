import { useNavigate } from "react-router-dom";
import { Check, Star, Crown, Zap } from "lucide-react";

const plans = [
  {
    id: 1,
    name: "Shopydash Boost",
    price: "₦750",
    period: "/month",
    description: "Get noticed and reach more students instantly.",
    features: [
      "Your posts appear higher on students' feeds",
      "'Boosted Vendor' badge on profile",
      "2x more impressions from buyers",
      "Priority in location-based search results",
    ],
    cta: "Get Boost",
    icon: Zap,
    popular: false,
  },
  {
    id: 2,
    name: "Shopydash Pro",
    price: "₦1,500",
    period: "/month",
    description: "Professional tools to brand and grow your store.",
    features: [
      "All in Shopydash Boost",
      "Product upload limit increased to (8)",
      "Post upload limit increased to (5) per day",
      "Custom storefront banner & brand colors",
      "Product performance insights",
      "Option to pin one post to top of store",
    ],
    cta: "Go Pro",
    icon: Star,
    slug: "pro_monthly",
    popular: true,
  },
  {
    id: 3,
    name: "Shopydash Max",
    price: "₦3,000",
    period: "/month",
    description: "Maximum visibility and power for serious sellers.",
    features: [
      "All in Shopydash Pro",
      "Higher product upload limit (10)",
      "Post upload limit increased to (20) per day",
      "Advanced analytics dashboards",
      "Priority Support",
      "Post scheduling",
      "Vendor Verification Badge",
      "Your profile suggested to all users",
    ],
    cta: "Unlock Max",
    icon: Crown,
    slug: "business_plan",
    popular: false,
  },
];

export function Pricing() {
  return (
    <div
      id="pricing"
      className="bg-orange-50/30 py-24 font-sans relative overflow-hidden"
    >
      {}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            Flexible Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-n-8 mb-6 tracking-tight font-sora">
            Supercharge Your Sales
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-n-4 leading-relaxed">
            Choose the perfect plan to grow your business, reach more students,
            and build a professional brand on Vendors.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col items-stretch h-full bg-white rounded-3xl transition-all duration-300 group ${
                plan.popular
                  ? "shadow-2xl ring-2 ring-orange-500 scale-105 z-10"
                  : "shadow-lg border border-n-2/30 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 -mt-4 flex justify-center">
                  <span className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.popular
                        ? "bg-orange-50 text-orange-600"
                        : "bg-n-2/20 text-n-6"
                    }`}
                  >
                    <plan.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-n-8 font-sora">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-8 flex items-baseline">
                  <span className="text-5xl font-bold text-n-8 tracking-tight font-sora">
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className="text-n-4 ml-2 font-medium">
                      {plan.period}
                    </span>
                  )}
                  {plan.price === "Free" && (
                    <span className="sr-only">Free</span>
                  )}
                </div>

                <div className="mb-8 border-t border-dashed border-gray-100 pt-6">
                  <p className="text-n-4 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded-full ${
                            plan.popular
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                      <p className="ml-3 text-sm text-n-5 font-medium leading-5">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://app.shopydash.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-lg transform active:scale-95 flex items-center justify-center cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-200"
                      : "bg-n-8 text-white hover:bg-black"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
