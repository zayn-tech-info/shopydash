import React from "react";

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="bg-white rounded-lg p-4 shadow-sm">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="mt-2 text-2xl font-semibold">{c.value}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
