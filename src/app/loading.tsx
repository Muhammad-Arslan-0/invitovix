import { LuxLoader } from "@/components/ui/LuxLoader";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center">
      <LuxLoader
        title="Invitovix"
        subtitle="Loading interactive experience..."
      />
    </div>
  );
}

