import type { CreateOrganizationForm } from "../types/admin"

export const emptyCreateForm: CreateOrganizationForm = {
  country: "United States",
  state: "",
  name: "",
  email: "",
  domain: "",
  organizationType: "enterprise",
  researchField: "",
  licenseId: "",
  label: "Annual organization license",
  startsAt: new Date().toISOString().slice(0, 10),
  seatLimit: 7,
}
