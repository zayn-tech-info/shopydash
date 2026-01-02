import { Calendar, User, ShoppingBag } from "lucide-react";
import SubscriptionBadge from "../common/SubscriptionBadge";  

export function AccountInfo({ user }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Account Information</h2>
        <p className="text-n-4 mt-1">
          View details about your Shopydash account status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-n-3/20 bg-n-2/30">
          <div className="flex items-center gap-3 mb-4 text-n-5">
            <User size={20} />
            <span className="font-medium text-sm uppercase tracking-wider">
              Account Type
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold capitalize text-n-8">
              {user.role} Account
            </span>
            {user.role === "vendor" && (
              <span className="px-2 py-1 bg-primary-3/10 text-primary-3 text-xs font-bold rounded-lg border border-primary-3/20">
                Seller
              </span>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-n-3/20 bg-n-2/30">
          <div className="flex items-center gap-3 mb-4 text-n-5">
            <Calendar size={20} />
            <span className="font-medium text-sm uppercase tracking-wider">
              Member Since
            </span>
          </div>
          <div className="text-2xl font-bold text-n-8">
            {formatDate(user.createdAt)}
          </div>
        </div>

        {user.role === "vendor" && (
          <div className="md:col-span-2 p-6 rounded-2xl border border-primary-3/20 bg-primary-3/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-primary-3">
                <ShoppingBag size={20} />
                <span className="font-bold text-sm uppercase tracking-wider">
                  Subscription Plan
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-n-8 mb-1">
                  {user.subscriptionPlan || "Basic Free Plan"}
                </h3>
                <p
                  className={`text-sm font-medium ${
                    user.isSubscriptionActive ? "text-green-600" : "text-n-5"
                  }`}
                >
                  Status:{" "}
                  {user.isSubscriptionActive ? "Active" : "Inactive / Free"}
                </p>
              </div>
              {/*  Action Button could go here */}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-100">
        <strong>Note:</strong> Some account details like your Role and School
        cannot be changed manually. Please contact support if you need
        assistance.
      </div>
    </div>
  );
}
