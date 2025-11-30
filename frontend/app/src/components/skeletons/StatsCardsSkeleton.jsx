import React from "react";
import { Skeleton } from "@mui/material";

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
          <Skeleton variant="text" width="60%" height={20} className="mb-2" />
          <Skeleton variant="text" width="40%" height={40} />
        </div>
      ))}
    </div>
  );
}
