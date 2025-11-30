import React from "react";
import { StatsCardsSkeleton } from "../skeletons/StatsCardsSkeleton";

export function StatsCards({ stats, loading }) {
  const cards = [
    {
      key: "products",
      label: "Total Products",
      value: stats?.productCount ?? 0,
    },
    {
      key: "active",
      label: "Active Listings",
      value: stats?.activeListings ?? 0,
    },
    { key: "views", label: "Views (7d)", value: stats?.viewsLast7d ?? 0 },
    {
      key: "msgs",
      label: "Unread Messages",
      value: stats?.messagesUnread ?? 0,
    },
  ];

  if (loading) {
    return <StatsCardsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-500">{c.label}</div>
          <div className="mt-2 text-2xl font-semibold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
