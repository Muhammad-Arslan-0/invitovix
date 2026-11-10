export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* Top Navbar Skeleton */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl shimmer-skeleton" />
            <div className="w-24 h-5 rounded-lg shimmer-skeleton" />
          </div>
          <div className="w-24 h-8 rounded-xl shimmer-skeleton" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-xl shimmer-skeleton" />
            <div className="h-4 w-80 max-w-full rounded-lg shimmer-skeleton" />
          </div>
          <div className="h-10 w-36 rounded-xl shimmer-skeleton" />
        </div>

        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3"
            >
              <div className="h-3 w-24 rounded shimmer-skeleton" />
              <div className="h-8 w-14 rounded-lg shimmer-skeleton" />
            </div>
          ))}
        </div>

        <div className="mt-9">
          <div className="h-4 w-32 rounded shimmer-skeleton mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-stone-200 bg-white overflow-hidden"
              >
                <div className="h-32 shimmer-skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-3.5 w-36 rounded shimmer-skeleton" />
                  <div className="h-3.5 w-48 rounded shimmer-skeleton" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-9 rounded-xl shimmer-skeleton" />
                    <div className="h-9 rounded-xl shimmer-skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

