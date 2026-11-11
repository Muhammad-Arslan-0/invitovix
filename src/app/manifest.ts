import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Invitovix — Luxury Digital Invitations",
    short_name: "Invitovix",
    description:
      "Design and share interactive wax-seal invitations for Weddings, Birthdays, Galas, Baby Showers, and Celebrations.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfaf7",
    theme_color: "#060708",
    icons: [
      {
        src: "/brand/invitovix-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/invitovix-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
