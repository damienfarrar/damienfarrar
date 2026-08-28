import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content/repo";
import { yearsInProduction } from "@/lib/domain/experience";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Damien Farrar — full-stack engineer & architect, Melbourne";

// Set in the Dispatch system: neutral graphite ground, amber accent, keylines.
export default function Image() {
  const years = yearsInProduction(getProfile().careerStartYear);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#141414",
        color: "#e9e9e9",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          letterSpacing: 4,
          color: "#9a9a9c",
        }}
      >
        <span>DAMIENFARRAR.COM</span>
        <span style={{ color: "#ffb454" }}>MELBOURNE · AUS</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontWeight: 700,
          fontSize: 96,
          lineHeight: 1.05,
        }}
      >
        <span>{years} years</span>
        <span style={{ color: "#ffb454" }}>in production.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #38383a",
          paddingTop: 24,
          fontSize: 26,
          color: "#9a9a9c",
        }}
      >
        <span>Damien Farrar — engineer &amp; architect</span>
        <span>source public · decisions recorded</span>
      </div>
    </div>,
    size,
  );
}
