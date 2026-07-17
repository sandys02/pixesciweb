import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

export const portalAccounts = sqliteTable(
  "portal_accounts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    role: text("role").notNull().default("admin"),
    mustChangePassword: integer("must_change_password", { mode: "boolean" })
      .notNull()
      .default(true),
    setupCompletedAt: text("setup_completed_at"),
    failedLoginCount: integer("failed_login_count").notNull().default(0),
    lockedUntil: text("locked_until"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("portal_accounts_email_unique").on(table.email),
    index("portal_accounts_active_idx").on(table.active),
  ]
)

export const organizations = sqliteTable(
  "organizations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationType: text("organization_type").notNull(),
    country: text("country").notNull().default("United States"),
    state: text("state").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    domain: text("domain"),
    researchField: text("research_field").notNull(),
    status: text("status").notNull().default("active"),
    deactivatedAt: text("deactivated_at"),
    archivedAt: text("archived_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("organizations_domain_unique").on(table.domain),
    index("organizations_email_idx").on(table.email),
    index("organizations_status_idx").on(table.status),
  ]
)

export const adminAccounts = sqliteTable(
  "admin_accounts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    role: text("role").notNull().default("admin"),
    mustChangePassword: integer("must_change_password", { mode: "boolean" })
      .notNull()
      .default(false),
    failedLoginCount: integer("failed_login_count").notNull().default(0),
    lockedUntil: text("locked_until"),
    lastLoginAt: text("last_login_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("admin_accounts_email_unique").on(table.email),
    index("admin_accounts_active_idx").on(table.active),
    index("admin_accounts_role_idx").on(table.role),
  ]
)

export const adminAccountResetTokens = sqliteTable(
  "admin_account_reset_tokens",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    adminAccountId: integer("admin_account_id")
      .notNull()
      .references(() => adminAccounts.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    purpose: text("purpose").notNull(),
    expiresAt: text("expires_at").notNull(),
    usedAt: text("used_at"),
    createdByAdminId: integer("created_by_admin_id").references(
      () => adminAccounts.id,
      { onDelete: "set null" }
    ),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("admin_account_reset_tokens_hash_unique").on(table.tokenHash),
    index("admin_account_reset_tokens_account_idx").on(table.adminAccountId),
    index("admin_account_reset_tokens_expires_idx").on(table.expiresAt),
  ]
)

export const portalAccountOrganizations = sqliteTable(
  "portal_account_organizations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    accountId: integer("account_id")
      .notNull()
      .references(() => portalAccounts.id, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("portal_account_organizations_account_org_unique").on(
      table.accountId,
      table.organizationId
    ),
    index("portal_account_organizations_org_idx").on(table.organizationId),
  ]
)

export const licenses = sqliteTable(
  "licenses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    licenseId: text("license_id").notNull(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    startsAt: text("starts_at").notNull(),
    endsAt: text("ends_at").notNull(),
    seatLimit: integer("seat_limit").notNull(),
    label: text("label").notNull(),
    signedBundleVersion: integer("signed_bundle_version"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("licenses_license_id_unique").on(table.licenseId),
    index("licenses_organization_idx").on(table.organizationId),
    index("licenses_status_idx").on(table.status),
  ]
)

export const seats = sqliteTable(
  "seats",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    seatId: text("seat_id").notNull(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    licenseId: integer("license_id")
      .notNull()
      .references(() => licenses.id, { onDelete: "cascade" }),
    email: text("email"),
    role: text("role"),
    status: text("status").notNull(),
    inviteTokenHash: text("invite_token_hash"),
    inviteExpiresAt: text("invite_expires_at"),
    inviteAcceptedAt: text("invite_accepted_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("seats_seat_id_unique").on(table.seatId),
    uniqueIndex("seats_invite_token_hash_unique").on(table.inviteTokenHash),
    index("seats_organization_idx").on(table.organizationId),
    index("seats_license_idx").on(table.licenseId),
    index("seats_status_idx").on(table.status),
  ]
)

export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    actorAccountId: integer("actor_account_id").references(() => portalAccounts.id, {
      onDelete: "set null",
    }),
    actorSeatId: integer("actor_seat_id").references(() => seats.id, {
      onDelete: "set null",
    }),
    actorAdminAccountId: integer("actor_admin_account_id").references(
      () => adminAccounts.id,
      { onDelete: "set null" }
    ),
    actorType: text("actor_type").notNull().default("portal_account"),
    eventType: text("event_type").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("audit_events_organization_idx").on(table.organizationId),
    index("audit_events_actor_admin_idx").on(table.actorAdminAccountId),
    index("audit_events_event_type_idx").on(table.eventType),
    index("audit_events_created_at_idx").on(table.createdAt),
  ]
)

export const portalAccountResetTokens = sqliteTable(
  "portal_account_reset_tokens",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    portalAccountId: integer("portal_account_id")
      .notNull()
      .references(() => portalAccounts.id, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    purpose: text("purpose").notNull(),
    expiresAt: text("expires_at").notNull(),
    usedAt: text("used_at"),
    createdByAdminId: integer("created_by_admin_id").references(
      () => adminAccounts.id,
      { onDelete: "set null" }
    ),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("portal_account_reset_tokens_hash_unique").on(table.tokenHash),
    index("portal_account_reset_tokens_account_idx").on(table.portalAccountId),
    index("portal_account_reset_tokens_org_idx").on(table.organizationId),
    index("portal_account_reset_tokens_expires_idx").on(table.expiresAt),
  ]
)

export const licenseBundles = sqliteTable(
  "license_bundles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    licenseId: integer("license_id")
      .notNull()
      .references(() => licenses.id, { onDelete: "cascade" }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    bundleVersion: integer("bundle_version").notNull(),
    payloadJson: text("payload_json").notNull(),
    signature: text("signature").notNull(),
    publicKeyId: text("public_key_id").notNull(),
    generatedBy: integer("generated_by").references(() => portalAccounts.id, {
      onDelete: "set null",
    }),
    generatedAt: text("generated_at").notNull(),
    revokedAt: text("revoked_at"),
  },
  (table) => [
    index("license_bundles_license_idx").on(table.licenseId),
    index("license_bundles_organization_idx").on(table.organizationId),
    index("license_bundles_generated_at_idx").on(table.generatedAt),
  ]
)

export type PortalAccount = typeof portalAccounts.$inferSelect
export type NewPortalAccount = typeof portalAccounts.$inferInsert
export type AdminAccount = typeof adminAccounts.$inferSelect
export type NewAdminAccount = typeof adminAccounts.$inferInsert
export type AdminAccountResetToken =
  typeof adminAccountResetTokens.$inferSelect
export type NewAdminAccountResetToken =
  typeof adminAccountResetTokens.$inferInsert
export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
export type PortalAccountOrganization =
  typeof portalAccountOrganizations.$inferSelect
export type NewPortalAccountOrganization =
  typeof portalAccountOrganizations.$inferInsert
export type License = typeof licenses.$inferSelect
export type NewLicense = typeof licenses.$inferInsert
export type Seat = typeof seats.$inferSelect
export type NewSeat = typeof seats.$inferInsert
export type AuditEvent = typeof auditEvents.$inferSelect
export type NewAuditEvent = typeof auditEvents.$inferInsert
export type PortalAccountResetToken =
  typeof portalAccountResetTokens.$inferSelect
export type NewPortalAccountResetToken =
  typeof portalAccountResetTokens.$inferInsert
export type LicenseBundle = typeof licenseBundles.$inferSelect
export type NewLicenseBundle = typeof licenseBundles.$inferInsert
