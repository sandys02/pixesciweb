import { ImageResponse } from "next/og"

export const alt =
  "PixeSci TM, the autonomous quality control operating system for regulated life sciences"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f9fbfd",
        backgroundImage:
          "linear-gradient(112deg, #cfd5df 0%, #eef2f7 26%, #ffffff 42%, #dbe8fb 58%, #b6d3ff 70%, #e7eef7 86%, #cbd1db 100%)",
        color: "#1f2d3d",
        padding: "68px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "13px",
            background: "#0054d8",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            fontWeight: 700,
            fontStyle: "italic",
          }}
        >
          Px
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 700,
              color: "#0054d8",
              lineHeight: 1,
            }}
          >
            PixeSci
            <sup style={{ fontSize: "13px", marginLeft: "3px" }}>TM</sup>
          </span>
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "0.26em",
              color: "#526176",
              lineHeight: 1,
            }}
          >
            TALK TO YOUR LAB
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div
          style={{
            maxWidth: "980px",
            fontSize: "68px",
            lineHeight: 1.04,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          The autonomous quality control operating system for regulated life sciences.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "20px",
            letterSpacing: "0.22em",
            color: "#526176",
          }}
        >
          DATA
          <span style={{ color: "#8f9bb0" }}>·</span>
          QUALITY
          <span style={{ color: "#8f9bb0" }}>·</span>
          COMPLIANCE
          <span style={{ color: "#8f9bb0" }}>·</span>
          CONFIDENCE
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "6px",
          width: "100%",
          backgroundImage:
            "linear-gradient(90deg, #c7ccd6 0%, #eef2f7 20%, #ffffff 32%, #b6d3ff 50%, #0054d8 62%, #b6d3ff 74%, #dfe4ec 88%, #c7ccd6 100%)",
        }}
      />
    </div>,
    size
  )
}
