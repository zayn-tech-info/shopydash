import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { X, Crown, ArrowRight, Sparkles } from "lucide-react";

const PremiumBanner = () => {
  const { authUser } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(
      "shopydash_premium_banner_dismissed",
    );
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  if (
    !authUser ||
    authUser.role !== "vendor" ||
    authUser?.isSubscriptionActive
  ) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("shopydash_premium_banner_dismissed", "true");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X size={18} />
      </button>

      <div className="relative container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Content Section */}
          <div className="flex items-center gap-4 text-left flex-1">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
              <Crown className="h-6 w-6 text-yellow-300" />
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">
                  Unlock Vendor Premium
                </span>
                <span className="inline-flex items-center rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-300 border border-yellow-400/30">
                  <Sparkles className="mr-1 h-3 w-3" />
                  New
                </span>
              </div>
              <p className="text-sm text-indigo-100 max-w-xl">
                Get higher visibility, unlimited products, in-app messaging and priority support and <Link to="pricing" className="font-bold underline">more</Link>.
              </p>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/pricing"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-2 py-1 font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-lg active:scale-95 duration-200"
            >
              <span className="relative z-10 text-sm">Upgrade Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
