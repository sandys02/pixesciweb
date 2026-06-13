import { ImageResponse } from "next/og"

export const alt =
  "PixeSci: Compliance-First AI Workflow Orchestration Infrastructure"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fbfc",
          color: "#10191d",
          padding: "68px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: "#10191d",
              color: "#79e4ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            +
          </div>
          Pixesci
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              maxWidth: "960px",
              fontSize: "68px",
              lineHeight: 1.04,
              fontWeight: 700,
            }}
          >
            Connect scientific software into traceable workflows.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              fontSize: "23px",
              color: "#52636b",
            }}
          >
            Local-first
            <span style={{ color: "#a2b0b6" }}>·</span>
            Graph execution
            <span style={{ color: "#a2b0b6" }}>·</span>
            Audit history
            <span style={{ color: "#a2b0b6" }}>·</span>
            On-prem ready
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: "8px",
            width: "100%",
            borderRadius: "999px",
            background: "#dbe6e9",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "64%", background: "#1787a0" }} />
          <div style={{ width: "16%", background: "#50c9ca" }} />
          <div style={{ width: "20%", background: "#dbe6e9" }} />
        </div>
      </div>
    ),
    size,
  )
}
