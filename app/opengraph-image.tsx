import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content/repo";
import { yearsInProduction } from "@/lib/domain/experience";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Damien Farrar — full-stack engineer, Melbourne";

// Set in the ops-console direction: night ground, CRT amber, panel keylines.
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
        background: "#10151b",
        color: "#e2e8ee",
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
          color: "#8494a3",
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
        <span>{years} YEARS</span>
        <span style={{ color: "#ffb454" }}>IN PRODUCTION.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #27313d",
          paddingTop: 24,
          fontSize: 26,
          color: "#8494a3",
        }}
      >
        <span>Damien Farrar — Full-Stack Engineer</span>
        <span>source public · decisions recorded</span>
      </div>
    </div>,
    size,
  );
}
