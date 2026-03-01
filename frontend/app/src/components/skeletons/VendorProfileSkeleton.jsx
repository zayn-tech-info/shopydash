import React from "react";
import { Skeleton } from "@mui/material";

export function VendorProfileSkeleton() {
  return (
    <main className="min-h-[80vh] bg-n-1">
      <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[80rem] 2xl:max-w-[90rem] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8">
        {/* Header card - same structure as VendorProfileHeader */}
        <div className="rounded-2xl overflow-hidden border border-n-3/20 shadow-sm bg-white">
          {/* Cover - same wrapper as real: aspect-[3/1], min-heights, gradient */}
          <div className="relative w-full aspect-[3/1] min-h-[100px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] max-h-[240px] bg-gradient-to-br from-[#fdf4ef] via-[#f5e8e0] to-[#ebe2dc] overflow-hidden">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: 0, bgcolor: "rgba(0,0,0,0.05)" }}
            />
          </div>

          <div className="relative px-4 sm:px-6 md:px-8 pb-6">
            {/* Row 1: spacer (avatar width) + action buttons - same as header */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 -mt-3 mb-1 sm:mb-0">
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 pointer-events-none"
                aria-hidden
              />
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 3 }} />
              </div>
            </div>

            {/* Overlapping avatar - same position as VendorProfileHeader: left-4, -top-10 etc. */}
            <div className="absolute left-4 sm:left-6 md:left-8 -top-10 sm:-top-14 md:-top-16 z-10">
              <Skeleton
                variant="circular"
                sx={{
                  width: { xs: 80, sm: 112, md: 128 },
                  height: { xs: 80, sm: 112, md: 128 },
                  border: "4px solid #fff",
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Spacer below avatar row - matches header: h-0 sm:h-2 */}
            <div className="h-0 sm:h-2 shrink-0" />

            {/* Name + badge */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Skeleton variant="text" width="55%" height={32} sx={{ flexShrink: 0 }} />
              <Skeleton variant="circular" width={20} height={20} sx={{ flexShrink: 0 }} />
            </div>
            {/* @handle */}
            <Skeleton variant="text" width="28%" height={22} className="mb-3" />
            {/* Bio - 2–3 lines */}
            <Skeleton variant="text" width="100%" height={20} className="mb-1" />
            <Skeleton variant="text" width="95%" height={20} className="mb-1" />
            <Skeleton variant="text" width="70%" height={20} className="mb-4" />
            {/* Meta row (location, joined) */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 mb-4">
              <Skeleton variant="text" width={180} height={20} />
              <Skeleton variant="text" width={140} height={20} />
            </div>
            {/* Stats (Products, Reviews, Rating) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Skeleton variant="text" width={90} height={20} />
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="text" width={70} height={20} />
            </div>
          </div>
        </div>

        {/* First content card - AboutAndProducts: tabs + content */}
        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm min-h-[320px]">
            {/* Tab bar: Products | About | Reviews - same as AboutAndProducts */}
            <div className="flex items-center gap-8 mb-8 border-b border-n-3/10">
              <Skeleton variant="text" width={90} height={24} sx={{ flexShrink: 0 }} />
              <Skeleton variant="text" width={70} height={24} sx={{ flexShrink: 0 }} />
              <Skeleton variant="text" width={80} height={24} sx={{ flexShrink: 0 }} />
            </div>
            {/* Tab content area */}
            <Skeleton variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2 }} />
          </div>

          {/* Second card - VendorAddress */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm">
            <Skeleton variant="text" width="35%" height={28} className="mb-4" />
            <div className="space-y-3">
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="85%" height={24} />
            </div>
          </div>
        </div>

        {/* Auth card - Logged in as / Login */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 border border-n-3/20 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton variant="text" width={90} height={14} className="mb-1" />
              <Skeleton variant="text" width={180} height={22} />
            </div>
            <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 2, flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </main>
  );
}
