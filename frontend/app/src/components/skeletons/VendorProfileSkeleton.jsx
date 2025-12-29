import React from "react";
import { Skeleton } from "@mui/material";

export function VendorProfileSkeleton() {
  return (
    <main className="py-8 bg-n-1 min-h-[80vh]">
      <div className="container">
        {}
        <div className="relative bg-n-2/10 rounded-3xl overflow-hidden mb-8 border border-n-3/20 shadow-sm">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={224}
            className="md:h-48 lg:h-56"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full">
                <div className="flex flex-col items-center">
                  <Skeleton
                    variant="circular"
                    width={128}
                    height={128}
                    className="mb-4"
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={32}
                    className="mb-1"
                  />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={48}
                    className="mt-6 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
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

            {}
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
