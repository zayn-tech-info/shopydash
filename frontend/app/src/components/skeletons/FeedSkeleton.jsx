import { Skeleton } from "@mui/material";

export function FeedSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-2 md:px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <Skeleton variant="text" width={220} height={28} />
        <Skeleton variant="text" width={70} height={20} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-n-3/20 rounded-xl p-3 flex flex-col gap-3 h-full"
          >
            {}
            <div className="w-full aspect-square rounded-lg overflow-hidden">
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </div>

            {}
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="40%" height={24} />

              <div className="flex items-center gap-2 mt-auto pt-2">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
