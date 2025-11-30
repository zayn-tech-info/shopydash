import React from "react";
import { Skeleton } from "@mui/material";

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-4 shadow-sm h-64 flex flex-col"
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={160}
            className="rounded-md mb-4"
          />
          <Skeleton variant="text" width="80%" height={24} className="mb-2" />
          <Skeleton variant="text" width="40%" height={24} />
        </div>
      ))}
    </div>
  );
}
