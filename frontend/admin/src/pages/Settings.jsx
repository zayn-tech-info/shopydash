import { Card, CardContent } from "@mui/material";
import { Settings as SettingsIcon, Crown, Percent, Bell } from "lucide-react";

const plans = [
  { name: "Free", price: "₦0", features: "3 posts/12h, 4 products/post, basic analytics" },
  { name: "Shopydash Boost", price: "₦750/mo", features: "100 posts/12h, 50 products/post, priority feed, boosted badge" },
  { name: "Shopydash Pro", price: "₦1,500/mo", features: "150 posts/12h, messaging, featured products, custom branding" },
  { name: "Shopydash Max", price: "₦3,000/mo", features: "200 posts/12h, verification badge, homepage spotlight, scheduling" },
];

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Subscription Plans */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={20} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Subscription Plans
              </h3>
            </div>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{plan.name}</p>
                    <p className="text-sm font-medium text-indigo-600">
                      {plan.price}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{plan.features}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Config */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Percent size={20} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Platform Configuration
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Commission Rate</p>
                <p className="text-lg font-bold text-gray-900">5%</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Currency</p>
                <p className="text-lg font-bold text-gray-900">NGN (₦)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Payment Gateway</p>
                <p className="text-lg font-bold text-gray-900">Paystack</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", opacity: 0.6 }}>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Notification Preferences
              </h3>
            </div>
            <p className="text-sm text-gray-400">Coming in Phase 2</p>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", opacity: 0.6 }}>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={20} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Advanced Settings
              </h3>
            </div>
            <p className="text-sm text-gray-400">Coming in Phase 2</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
