export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen p-8 lg:p-24 space-y-24">
      {/* Hero Skeleton */}
      <div className="flex flex-col gap-6 animate-pulse mt-20">
        <div className="h-16 w-3/4 max-w-2xl bg-[#121212] rounded-xl border border-[#222222]"></div>
        <div className="h-20 w-full max-w-3xl bg-[#121212] rounded-xl border border-[#222222]"></div>
        <div className="h-10 w-48 bg-[#121212] rounded-md border border-[#222222] mt-4"></div>
      </div>

      {/* About Skeleton */}
      <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
        <div className="w-full lg:w-1/3">
          <div className="h-8 w-32 bg-[#121212] rounded-md mb-6"></div>
          <div className="h-48 w-full bg-[#121212] rounded-xl border border-[#222222]"></div>
        </div>
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="h-6 w-full bg-[#121212] rounded-md"></div>
          <div className="h-6 w-full bg-[#121212] rounded-md"></div>
          <div className="h-6 w-3/4 bg-[#121212] rounded-md"></div>
          <div className="h-6 w-5/6 bg-[#121212] rounded-md"></div>
        </div>
      </div>

      {/* Grid Layout Skeleton (Mindset/Projects) */}
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-40 bg-[#121212] rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 w-full bg-[#121212] rounded-xl border border-[#222222]"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
