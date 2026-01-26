import { Skeleton } from "@mui/material";

export function FeedSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 mt-12 pb-20">
      <div className="flex items-center justify-between mb-8">
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="text" width={60} height={20} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
