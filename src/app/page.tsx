import { LandingShowcase } from "@/components/landing/LandingShowcase";
import { AuthRedirectHandler } from "@/components/auth/AuthRedirectHandler";

export default function HomePage() {
  return (
    <>
      <AuthRedirectHandler />
      <LandingShowcase />
    </>
  );
}
