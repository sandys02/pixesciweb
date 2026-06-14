"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      organization: formData.get("organization"),
      role: formData.get("role"),
      inquiryType: formData.get("inquiry-type"),
      deployment: formData.get("deployment"),
      objective: formData.get("objective"),
      message: formData.get("message"),
      website: formData.get("website"),
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as {
        error?: string
        success?: boolean
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to submit your request.")
      }

      form.reset()
      setStatus("success")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your request."
      )
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Organization"
          name="organization"
          autoComplete="organization"
          required
        />
        <Field
          label="Role"
          name="role"
          autoComplete="organization-title"
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="How can we help?"
          name="inquiry-type"
          options={[
            "Request a product demo",
            "Map a workflow or software stack",
            "Plan a pilot or evaluation",
            "Discuss pricing or procurement",
            "Review security or deployment",
          ]}
        />
        <SelectField
          label="Deployment priority"
          name="deployment"
          options={[
            "Managed workstation",
            "On-prem infrastructure",
            "Airgapped / controlled environment",
            "Hybrid environment",
            "Still evaluating",
          ]}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="objective">What are you trying to improve?</Label>
        <Textarea
          id="objective"
          name="objective"
          className="min-h-28 resize-y"
          placeholder="For example: reduce QC handoffs, standardize execution, improve traceability, or connect a scientific software stack"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Additional context</Label>
        <Textarea
          id="message"
          name="message"
          className="min-h-28 resize-y"
          placeholder="Software, teams, sites, validation expectations, security review, or timing"
        />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-muted-foreground">
          We use these details only to respond to your request and plan the
          right technical conversation.
        </p>
        <Button
          type="submit"
          size="lg"
          className="px-4"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <LoaderCircle className="animate-spin" />
              Sending request
            </>
          ) : (
            "Request a demo"
          )}
        </Button>
      </div>
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="flex gap-3 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          Your request has been sent. We will follow up with you shortly.
        </div>
      ) : null}
      {status === "error" ? (
        <div
          role="alert"
          className="flex gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-950"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </div>
      ) : null}
    </form>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        className="h-11"
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        maxLength={type === "email" ? 254 : 160}
      />
    </div>
  )
}

type SelectFieldProps = {
  label: string
  name: string
  options: string[]
}

function SelectField({ label, name, options }: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} required>
        <SelectTrigger id={name} className="h-11 w-full">
          <SelectValue placeholder="Select one" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
