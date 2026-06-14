"use client"

import * as React from "react"
import { HelpCircle, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

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

const requiredFields = [
  "name",
  "email",
  "organization",
  "role",
  "inquiry-type",
  "deployment",
  "objective",
] as const

export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting">("idle")
  const [isReadyToSubmit, setIsReadyToSubmit] = React.useState(false)

  function handleFormChange(event: React.SyntheticEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    const completed = requiredFields.every((field) => {
      const value = formData.get(field)
      return typeof value === "string" && value.trim().length > 0
    })

    setIsReadyToSubmit(completed)
  }

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault()

    if (!isReadyToSubmit || status === "submitting") return

    setStatus("submitting")

    const form = event.currentTarget
    const formData = new FormData(form)
    const loadingToast = toast.loading("Sending request...")

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
        toast.error("Unable to submit request", {
          id: loadingToast,
          description: result.error || "Unable to submit your request.",
        })

        return
      }

      form.reset()
      setIsReadyToSubmit(false)

      toast.success("Request submitted successfully", {
        id: loadingToast,
        description:
          "Thank you for contacting PixeSci. We will follow up shortly.",
      })
    } catch {
      toast.error("Unable to submit request", {
        id: loadingToast,
        description: "Please check your connection and try again.",
      })
    } finally {
      setStatus("idle")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      className="grid gap-5"
    >
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
          required
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
          required
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
        <FieldLabel
          label="What are you trying to improve?"
          htmlFor="objective"
          required
        />
        <Textarea
          id="objective"
          name="objective"
          className="min-h-28 resize-y"
          placeholder="For example: reduce QC handoffs, standardize execution, improve traceability, or connect a scientific software stack"
          required
        />
      </div>

      <div className="grid gap-2">
        <FieldLabel
          label="Additional context"
          htmlFor="message"
          optionalHelp="This helps us understand your software stack, team setup, timeline, or security requirements before the first conversation."
        />
        <Textarea
          id="message"
          name="message"
          className="min-h-28 resize-y"
          placeholder="Software, teams, sites, validation expectations, security review, or timing"
        />
      </div>

      <div className="absolute left-[-9999px]" aria-hidden="true">
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
          disabled={!isReadyToSubmit || status === "submitting"}
          className="px-4 transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
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
    </form>
  )
}

type FieldLabelProps = {
  label: string
  htmlFor: string
  required?: boolean
  optionalHelp?: string
}

function FieldLabel({
  label,
  htmlFor,
  required = false,
  optionalHelp,
}: FieldLabelProps) {
  return (
    <div className="flex min-h-5 items-center gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>

      {!required ? (
        <>
          <span className="text-xs text-muted-foreground">(optional)</span>
          {optionalHelp ? (
            <span className="group relative inline-flex">
              <HelpCircle className="size-3.5 text-muted-foreground" />
              <span className="pointer-events-none absolute top-6 left-1/2 z-20 hidden w-64 -translate-x-1/2 rounded-md border bg-popover p-3 text-xs leading-5 text-popover-foreground shadow-md group-hover:block">
                {optionalHelp}
              </span>
            </span>
          ) : null}
        </>
      ) : null}
    </div>
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
      <FieldLabel label={label} htmlFor={name} required={required} />
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
  required?: boolean
}

function SelectField({
  label,
  name,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <FieldLabel label={label} htmlFor={name} required={required} />
      <Select name={name} required={required}>
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
