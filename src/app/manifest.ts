import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Invitovix — Live Digital Invitation Cards",
    short_name: "Invitovix",
    description:
      "Design and share interactive wax-seal live invitation cards for Weddings, Nikah, Mehndi, Birthdays, Galas, Baby Showers & Celebrations.",
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
