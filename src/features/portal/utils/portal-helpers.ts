import type {
  PortalAccountSetupForm,
  PortalLicense,
} from "../types/portal"

export function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
}

export function validateSetupForm(
  form: PortalAccountSetupForm,
  options: { validatePassword: boolean } = { validatePassword: true }
) {
  const errors: Partial<Record<keyof PortalAccountSetupForm, string>> = {}

  if (!form.state.trim()) {
    errors.state = "State is required."
  }
  if (!form.name.trim()) {
    errors.name = "Organization name is required."
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid organization email."
  }
  const domain = normalizeDomain(form.domain)
  if (domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
    errors.domain = "Enter a valid organization domain."
  }
  if (!form.researchField.trim()) {
    errors.researchField = "Research field is required."
  }
  if (options.validatePassword) {
    if (form.newPassword.length < 10) {
      errors.newPassword = "Use at least 10 characters."
    }
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }
  }

  return errors
}

export function validatePasswordChange(form: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const errors: Partial<Record<keyof typeof form, string>> = {}

  if (form.currentPassword.length < 8) {
    errors.currentPassword = "Enter your current portal password."
  }
  if (form.newPassword.length < 10) {
    errors.newPassword = "Use at least 10 characters."
  }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match."
  }

  return errors
}

export function formatPortalDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

export function countActiveSeats(license: PortalLicense) {
  return license.seats.filter((seat) => seat.status === "active").length
}

export function countAllocatedSeats(license: PortalLicense) {
  return license.seats.filter(
    (seat) => seat.status === "active" || seat.status === "invited"
  ).length
}
