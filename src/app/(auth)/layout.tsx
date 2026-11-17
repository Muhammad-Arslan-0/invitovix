import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host Sign In",
  description:
    "Sign in to the Invitovix Creator Studio to design live digital invitation cards and track RSVPs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
