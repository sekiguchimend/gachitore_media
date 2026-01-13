export default function Loading() {
  return (
    <div className="bg-black min-h-screen grid-bg pt-16">
      <div className="container py-8">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8 pb-4 border-b border-[#1a1a1a]">
            <div className="h-6 w-32 bg-[#111] rounded"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="relative aspect-video bg-[#111] border border-[#1a1a1a] rounded"></div>
                <div className="h-4 bg-[#111] rounded w-3/4"></div>
                <div className="h-3 bg-[#111] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

