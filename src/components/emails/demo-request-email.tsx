import * as React from "react"

export type DemoRequest = {
  name: string
  email: string
  organization: string
  role: string
  inquiryType: string
  deployment: string
  objective: string
  message: string
}

type DemoRequestEmailProps = {
  request: DemoRequest
}

const labelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  paddingBottom: "4px",
  textTransform: "uppercase",
}

const valueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "15px",
  lineHeight: "24px",
  paddingBottom: "20px",
  whiteSpace: "pre-wrap",
}

export function DemoRequestEmail({ request }: DemoRequestEmailProps) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          margin: "0 auto",
          maxWidth: "640px",
          padding: "32px",
        }}
      >
        <p
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            margin: "0 0 12px",
            textTransform: "uppercase",
          }}
        >
          Pixesci website
        </p>
        <h1 style={{ fontSize: "24px", margin: "0 0 8px" }}>
          New demo request
        </h1>
        <p
          style={{
            color: "#475569",
            fontSize: "15px",
            lineHeight: "24px",
            margin: "0 0 28px",
          }}
        >
          {request.name} from {request.organization} submitted the request demo
          form.
        </p>

        <table
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <tbody>
            <EmailField label="Name" value={request.name} />
            <EmailField label="Work email" value={request.email} />
            <EmailField label="Organization" value={request.organization} />
            <EmailField label="Role" value={request.role} />
            <EmailField label="Inquiry type" value={request.inquiryType} />
            <EmailField
              label="Deployment priority"
              value={request.deployment}
            />
            <EmailField label="Objective" value={request.objective} />
            <EmailField
              label="Additional context"
              value={request.message || "Not provided"}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmailField({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td>
        <div style={labelStyle}>{label}</div>
        <div style={valueStyle}>{value}</div>
      </td>
    </tr>
  )
}
