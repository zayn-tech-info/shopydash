import { useNavigate } from "react-router-dom";
import { CreditCard, History, TrendingUp, Wallet } from "lucide-react";

export function WalletSettings({ user }) {
  const navigate = useNavigate();
  const isVendor = user.role === "vendor";

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Wallet & Transactions</h2>
        <p className="text-n-4 mt-1">
          {isVendor
            ? "Track your earnings and manage payouts."
            : "View your purchase history and payment methods."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-n-8 to-n-7 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Wallet size={100} />
          </div>
          <div className="relative z-10">
            <h4 className="text-n-3 text-sm font-medium uppercase tracking-wider mb-2">
              {isVendor ? "Total Earnings" : "Total Spent"}
            </h4>
            <div className="text-4xl font-bold font-code mb-4">
              ₦ {isVendor ? "0.00" : "0.00"}
              {}
            </div>

            {isVendor && (
              <div className="flex items-center gap-2 text-xs text-n-3/80 bg-white/10 w-fit px-2 py-1 rounded-lg">
                <span>5% platform commission fees applied</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isVendor && (
            <button
              onClick={() => navigate("/vendor/settings/bank")}
              className="w-full flex items-center justify-between p-4 bg-white border border-n-3/20 rounded-xl hover:border-primary-3 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors">
                  <CreditCard size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-n-8">Payout Settings</h4>
                  <p className="text-sm text-n-5">
                    Manage bank account for withdrawals
                  </p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => navigate("/orders")}
            className="w-full flex items-center justify-between p-4 bg-white border border-n-3/20 rounded-xl hover:border-primary-3 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
                <History size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-n-8">Transaction History</h4>
                <p className="text-sm text-n-5">View all your past orders</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {isVendor && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
          <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Pro Tip:</strong> To view detailed analytics about your
            sales performance, visit your{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="underline font-bold"
            >
              Vendor Dashboard
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
