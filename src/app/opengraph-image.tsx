import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/siteConfig";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 68px",
          background:
            "linear-gradient(135deg, #0c1411 0%, #11241c 48%, #1c1712 100%)",
          color: "#faf6ee",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Subtle Gold Inner Frame */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1.5px solid rgba(201, 154, 59, 0.45)",
            borderRadius: 28,
            display: "flex",
          }}
        />

        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                background:
                  "radial-gradient(circle at 32% 32%, #e0b865 0%, #b3842b 65%, #785216 100%)",
                border: "2px solid rgba(255, 245, 220, 0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "#fffaf0",
                letterSpacing: 1,
              }}
            >
              IX
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#faf6ee",
                }}
              >
                INVITOVIX
              </span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#d9b466",
                  fontFamily: "sans-serif",
                }}
              >
                Interactive Wax-Seal Digital Invitations
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid rgba(217, 180, 102, 0.45)",
              background: "rgba(217, 180, 102, 0.12)",
              fontSize: 16,
              color: "#f2d89b",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            Live RSVP | Music | Maps | QR
          </div>
        </div>

        {/* Center Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 700,
              color: "#fcfaf5",
              letterSpacing: -0.5,
            }}
          >
            Live Digital Invitation Cards
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.38,
              color: "#dfd5c3",
              fontFamily: "sans-serif",
              fontWeight: 400,
            }}
          >
            Design animated wax-seal invitations for Weddings (Nikah, Mehndi,
            Baraat, Valima), Birthdays, Baby Showers, Anniversaries &amp; Galas.
          </div>
        </div>

        {/* Footer Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(201, 154, 59, 0.28)",
            paddingTop: 22,
            fontFamily: "sans-serif",
            fontSize: 17,
            color: "#d6c8ae",
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            <span>Weddings &amp; Nikah</span>
            <span>|</span>
            <span>Birthdays</span>
            <span>|</span>
            <span>Showers &amp; Graduations</span>
            <span>|</span>
            <span>Black-Tie Galas</span>
          </div>
          <div
            style={{
              color: "#e6c273",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Start Designing Free
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
