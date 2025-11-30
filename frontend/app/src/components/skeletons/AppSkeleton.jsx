import React from "react";
import { Skeleton } from "@mui/material";

export function AppSkeleton() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="h-16 border-b border-n-3/10 flex items-center px-4 md:px-8 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={100} height={24} />
        </div>
        <div className="hidden md:flex gap-4">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-8 pb-20 py-8">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          className="rounded-2xl mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            className="rounded-xl"
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            className="rounded-xl"
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
