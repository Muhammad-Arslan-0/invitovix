import { LuxLoader } from "@/components/ui/LuxLoader";

export default function StudioLoading() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#fcfaf7] overflow-hidden">
      {/* Studio TopBar Skeleton */}
      <header className="h-15 border-b border-stone-200 bg-white px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 rounded-xl shimmer-skeleton" />
          <div className="h-6 w-44 rounded-lg shimmer-skeleton" />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block h-8 w-20 rounded-xl shimmer-skeleton" />
          <div className="h-8 w-20 rounded-xl shimmer-skeleton" />
          <div className="h-8 w-24 rounded-xl shimmer-skeleton" />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Inspector Skeleton */}
        <aside className="w-full lg:w-[370px] xl:w-[400px] border-r border-stone-200 bg-white flex flex-col shrink-0 p-4 space-y-4">
          <div className="grid grid-cols-4 gap-1.5 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-11 rounded-lg shimmer-skeleton" />
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-4 w-28 rounded shimmer-skeleton" />
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl shimmer-skeleton" />
              ))}
            </div>
            <div className="h-4 w-36 rounded shimmer-skeleton pt-3" />
            <div className="h-28 rounded-2xl shimmer-skeleton" />
          </div>
        </aside>

        {/* Center Canvas Skeleton */}
        <div className="flex-1 drafting-grid flex flex-col overflow-hidden">
          <div className="h-12 border-b border-stone-200 bg-white/80 px-4 flex items-center justify-between">
            <div className="h-8 w-44 rounded-xl shimmer-skeleton" />
            <div className="h-8 w-52 rounded-xl shimmer-skeleton" />
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-[390px] max-w-full h-[640px] rounded-[44px] border-[10px] border-stone-900 bg-[#fcfaf7] shadow-2xl flex items-center justify-center">
              <LuxLoader
                compact
                title="Opening Creator Studio"
                subtitle="Hydrating your live invitation canvas, fonts, and motion layers..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

