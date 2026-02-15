import React, { memo } from "react";
import { BadgeCheck } from "lucide-react";

const SubscriptionBadge = ({ plan, size = "sm", className = "" }) => {
  if (!plan) return null;

  const config = {
    "Shopydash Boost": { fill: "fill-blue-500", text: "text-white" },
    "Shopydash Pro": { fill: "fill-orange-500", text: "text-white" },
    "Shopydash Max": { fill: "fill-purple-600", text: "text-white" },
  };

  const badge = config[plan];
  if (!badge) return null;

  const iconSizes = {
    xs: 16,
    sm: 18,
    md: 20,
    lg: 24,
  };

  return (
    <BadgeCheck
      size={iconSizes[size] || 16}
      className={`${badge.fill} ${badge.text} flex-shrink-0 ${className}`}
      title={plan}
      aria-label={`${plan} Badge`}
    />
  );
};

export default memo(SubscriptionBadge);
