import { LuxLoader } from "@/components/ui/LuxLoader";

export default function GuestInvitationLoading() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg flex items-center justify-center px-6">
      <LuxLoader
        title="Preparing Your Invitation"
        subtitle="Readying your sealed envelope, typography, and celebration details..."
      />
    </div>
  );
}

