import React, { memo } from "react";

import { Check } from "lucide-react";

const SubscriptionBadge = ({ plan, size = "sm", className = "" }) => {
  if (!plan) return null;

  const config = {
    "Shopydash Boost": { bg: "bg-blue-600", text: "text-white" },
    "Shopydash Pro": { bg: "bg-orange-500", text: "text-white" },
    "Shopydash Max": { bg: "bg-purple-600", text: "text-white" },
  };

  const badge = config[plan];
  if (!badge) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center shadow-sm ${
        badge.bg
      } ${badge.text} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      title={plan}
      aria-label={`${plan} Badge`}
    >
      <Check size={iconSizes[size] || 10} strokeWidth={4} />
    </div>
  );
};

export default memo(SubscriptionBadge);
