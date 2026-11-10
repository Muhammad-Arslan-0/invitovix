export default function RsvpsLoading() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded shimmer-skeleton" />
            <div className="h-8 w-64 rounded-xl shimmer-skeleton" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-28 rounded-xl shimmer-skeleton" />
            <div className="h-9 w-28 rounded-xl shimmer-skeleton" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2"
            >
              <div className="h-3 w-20 rounded shimmer-skeleton" />
              <div className="h-7 w-12 rounded shimmer-skeleton" />
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl shimmer-skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}

