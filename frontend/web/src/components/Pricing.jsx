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
      className="bg-orange-50/50 py-24 font-sans border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-3">
            Premium Plans
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Supercharge Your Sales
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 leading-relaxed">
            Choose the perfect plan to grow your business, reach more students,
            and build a professional brand on Vendors.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col items-stretch h-full bg-white rounded-3xl transition-all duration-300 hover:shadow-xl group ${
                plan.popular
                  ? "shadow-xl ring-2 ring-orange-500 scale-105 z-10"
                  : "shadow-lg border border-gray-100"
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
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.popular
                        ? "bg-orange-50 text-orange-600"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <plan.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-gray-500 text-sm leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className="text-gray-500 ml-1 font-medium">
                      {plan.period}
                    </span>
                  )}
                  {plan.price === "Free" && (
                    <span className="text-gray-500 ml-1 font-medium text-sm sr-only">
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600 font-medium leading-5">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://app.shopydash.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-md transform active:scale-95 flex items-center justify-center cursor-pointer ${
                    plan.popular
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-800 text-white hover:bg-gray-900"
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
