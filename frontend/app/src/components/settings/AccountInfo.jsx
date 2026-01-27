import {
  Calendar,
  User,
  ShoppingBag,
  ArrowLeftRight,
  X,
  UserPlus,
} from "lucide-react";
import SubscriptionBadge from "../common/SubscriptionBadge";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AccountInfo({ user }) {
  const { switchRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showVendorPopup, setShowVendorPopup] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSwitchRole = async () => {
    const newRole = user.role === "client" ? "vendor" : "client";
    setLoading(true);
    try {
      await switchRole(newRole);
    } catch (error) {
      if (error === "VENDOR_PROFILE_REQUIRED") {
        setShowVendorPopup(true);
      } else {
        alert(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Account Information</h2>
        <p className="text-n-4 mt-1">
          View details about your Shopydash account status and manage your role.
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

        {/* Role Management Section */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-n-3/20 bg-white">
          <div className="flex items-center gap-3 mb-4 text-n-5">
            <ArrowLeftRight size={20} />
            <span className="font-medium text-sm uppercase tracking-wider">
              Role Management
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-n-8">Switch Role</h3>
              <p className="text-n-4 text-sm mt-1">
                Switch between Client (Buying) and Vendor (Selling) modes.
                <br />
                Currently active:{" "}
                <strong>{user.role === "client" ? "Buyer" : "Seller"}</strong>
              </p>
            </div>
            <button
              onClick={handleSwitchRole}
              disabled={loading}
              className="px-6 py-2.5 bg-n-8 text-white rounded-xl font-bold hover:bg-n-7 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading
                ? "Switching..."
                : `Switch to ${user.role === "client" ? "Vendor" : "Client"}`}
            </button>
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
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
        <User size={18} className="mt-0.5" />
        <div>
          <strong>Info:</strong> You can switch roles at any time. Your data for
          each role is preserved securely.
        </div>
      </div>

      {/* Vendor Profile Popup */}
      {showVendorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-n-8/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowVendorPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-n-2 rounded-full transition-colors text-n-5"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-3/10 rounded-full flex items-center justify-center text-primary-3 mb-6">
                <UserPlus size={32} />
              </div>

              <h3 className="text-2xl font-bold text-n-8 mb-2">
                Become a Seller
              </h3>
              <p className="text-n-4 mb-8">
                To switch to a Vendor account, you first need to set up your
                store profile. It only takes a few minutes!
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => navigate("/create-vendor-profile")}
                  className="w-full py-3.5 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-3/90 transition-colors shadow-lg shadow-primary-3/20"
                >
                  Create Vendor Profile
                </button>
                <button
                  onClick={() => setShowVendorPopup(false)}
                  className="w-full py-3.5 bg-transparent text-n-5 font-bold hover:text-n-8 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
