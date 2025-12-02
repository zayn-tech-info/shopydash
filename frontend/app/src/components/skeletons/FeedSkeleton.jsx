 import { Skeleton } from "@mui/material";

export function FeedSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="text" width={60} height={20} />
      </div>

      {/* Post Skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-n-3/10 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-n-3/10">
            <div className="flex items-center gap-4 w-full">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex flex-col gap-1 w-full max-w-[200px]">
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={16} />
              </div>
            </div>
            <Skeleton variant="circular" width={32} height={32} />
          </div>

          {/* Caption */}
          <div className="px-6 py-4 border-b border-n-3/10">
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
          </div>

          {/* Product Carousel Skeleton */}
          <div className="p-6 bg-n-1">
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 4 }).map((_, pIndex) => (
                <div
                  key={pIndex}
                  className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
                >
                  <div className="bg-white rounded-xl border border-n-3/10 overflow-hidden h-full">
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <div className="p-3">
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={32}
                          className="rounded-lg"
                        />
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={32}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-n-3/10 flex items-center justify-end gap-3">
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              className="rounded-xl"
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              className="rounded-xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
