import React from "react";
import { Skeleton } from "@mui/material";

export function ClientProfileSkeleton() {
  return (
    <main className="py-12 bg-n-1 min-h-[80vh]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Profile Info Skeleton */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <aside className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <Skeleton
                    variant="circular"
                    width={128}
                    height={128}
                    className="mb-4"
                  />
                  {/* Name */}
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={32}
                    className="mb-1"
                  />
                  {/* Username */}
                  <Skeleton variant="text" width="40%" height={24} />
                  {/* Button */}
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={48}
                    className="mt-6 rounded-xl"
                  />
                </div>
                <div className="mt-6 pt-4 border-t border-n-3/10 w-full">
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={20}
                    className="mx-auto"
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    className="mx-auto mt-2"
                  />
                </div>
              </aside>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <Skeleton
                variant="text"
                width="40%"
                height={40}
                className="mb-2"
              />
              <div className="flex gap-4">
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="circular" width={4} height={4} />
                <Skeleton variant="text" width={150} height={24} />
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm min-h-[400px]">
              <Skeleton
                variant="text"
                width="30%"
                height={32}
                className="mb-4"
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                className="rounded-xl"
              />
            </div>

            {/* Contact Info Section */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <Skeleton
                variant="text"
                width="30%"
                height={32}
                className="mb-4"
              />
              <div className="space-y-4">
                <Skeleton variant="text" width="100%" height={24} />
                <Skeleton variant="text" width="100%" height={24} />
                <Skeleton variant="text" width="80%" height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
