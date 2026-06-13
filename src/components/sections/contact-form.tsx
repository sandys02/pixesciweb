"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Work email" name="email" type="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization" name="organization" required />
        <Field label="Role" name="role" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Scientific domain"
          name="domain"
          options={[
            "Regulated life sciences",
            "Secure research",
            "Core facility",
            "Other",
          ]}
        />
        <SelectField
          label="Deployment requirement"
          name="deployment"
          options={[
            "Workstation",
            "On-prem",
            "Airgapped / controlled",
            "Unsure",
          ]}
        />
      </div>
      <label className="text-sm font-medium">
        Software stack
        <textarea
          name="software-stack"
          className="field"
          placeholder="Scientific applications, instruments, LIMS / ELN, scripts, repositories"
          required
        />
      </label>
      <label className="text-sm font-medium">
        Workflow pain
        <textarea
          name="workflow-pain"
          className="field"
          placeholder="Describe the manual handoffs, review gaps, or reproducibility problem"
          required
        />
      </label>
      <label className="text-sm font-medium">
        Additional context
        <textarea
          name="message"
          className="field"
          placeholder="Validation, security, timing, or facility requirements"
        />
      </label>
      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-muted-foreground">
          This form is a static interface placeholder. No submission backend or
          external form provider has been configured.
        </p>
        <button type="submit" className="button button-primary">
          Request demo
        </button>
      </div>
      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="flex gap-3 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          Form validation is complete. Submission remains disabled until a
          delivery backend is approved and configured.
        </div>
      ) : null}
    </form>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        className="field"
        type={type}
        name={name}
        required={required}
        autoComplete={name}
      />
    </label>
  )
}

type SelectFieldProps = {
  label: string
  name: string
  options: string[]
}

function SelectField({ label, name, options }: SelectFieldProps) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select className="field" name={name} defaultValue="" required>
        <option value="" disabled>
          Select one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
