import { LuxLoader } from "@/components/ui/LuxLoader";

export default function GuestInvitationLoading() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg md:bg-[#100E0C] flex items-center justify-center px-6">
      <div className="w-full md:w-[440px] md:min-h-[560px] md:rounded-[28px] md:bg-[#fcfaf7] md:luxury-editorial-bg md:border md:border-white/15 md:shadow-2xl flex items-center justify-center p-8">
        <LuxLoader
          title="Preparing Your Invitation"
          subtitle="Readying your sealed envelope, typography, and celebration details..."
        />
      </div>
    </div>
  );
}

