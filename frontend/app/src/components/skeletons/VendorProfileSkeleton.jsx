import React from "react";
import { Skeleton } from "@mui/material";

export function VendorProfileSkeleton() {
  return (
    <main className="min-h-[80vh] bg-n-1">
      <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[80rem] 2xl:max-w-[90rem] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8">
        {/* Twitter-style header skeleton */}
        <div className="rounded-2xl overflow-hidden border border-n-3/20 shadow-sm bg-white">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={140}
            className="sm:h-[160px] md:h-[180px]"
            sx={{ borderRadius: 0 }}
          />
          <div className="relative px-4 sm:px-6 md:px-8 pb-6">
            <div className="absolute left-4 sm:left-6 md:left-8 -top-12 sm:-top-14 md:-top-16">
              <Skeleton
                variant="circular"
                width={96}
                height={96}
                className="sm:w-[112px] sm:h-[112px] md:w-[128px] md:h-[128px] border-4 border-white"
              />
            </div>
            <div className="h-14 sm:h-16 md:h-20" />
            <div className="flex justify-end gap-2 mb-4">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rounded" width={100} height={40} />
            </div>
            <Skeleton variant="text" width="60%" height={36} className="mb-1" />
            <Skeleton variant="text" width="30%" height={24} className="mb-3" />
            <Skeleton variant="text" width="100%" height={20} className="mb-2" />
            <Skeleton variant="text" width="80%" height={20} className="mb-4" />
            <div className="flex gap-6">
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm min-h-[320px]">
            <Skeleton variant="text" width="30%" height={32} className="mb-4" />
            <Skeleton variant="rectangular" width="100%" height={200} className="rounded-xl" />
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm">
            <Skeleton variant="text" width="30%" height={32} className="mb-4" />
            <div className="space-y-4">
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="80%" height={24} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
