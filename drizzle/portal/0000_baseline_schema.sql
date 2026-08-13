CREATE TABLE IF NOT EXISTS `admin_account_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_account_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`purpose` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_by_admin_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`admin_account_id`) REFERENCES `admin_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `admin_account_reset_tokens_hash_unique` ON `admin_account_reset_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `admin_account_reset_tokens_account_idx` ON `admin_account_reset_tokens` (`admin_account_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `admin_account_reset_tokens_expires_idx` ON `admin_account_reset_tokens` (`expires_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `admin_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`must_change_password` integer DEFAULT false NOT NULL,
	`failed_login_count` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	`last_login_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `admin_accounts_email_unique` ON `admin_accounts` (`email`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `admin_accounts_active_idx` ON `admin_accounts` (`active`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `admin_accounts_role_idx` ON `admin_accounts` (`role`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer,
	`actor_account_id` integer,
	`actor_seat_id` integer,
	`actor_admin_account_id` integer,
	`actor_type` text DEFAULT 'portal_account' NOT NULL,
	`event_type` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`metadata_json` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_account_id`) REFERENCES `portal_accounts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_seat_id`) REFERENCES `seats`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_admin_account_id`) REFERENCES `admin_accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `audit_events_organization_idx` ON `audit_events` (`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `audit_events_actor_admin_idx` ON `audit_events` (`actor_admin_account_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `audit_events_event_type_idx` ON `audit_events` (`event_type`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `audit_events_created_at_idx` ON `audit_events` (`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `license_bundles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`license_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`bundle_version` integer NOT NULL,
	`payload_json` text NOT NULL,
	`signature` text NOT NULL,
	`public_key_id` text NOT NULL,
	`generated_by` integer,
	`generated_at` text NOT NULL,
	`revoked_at` text,
	FOREIGN KEY (`license_id`) REFERENCES `licenses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`generated_by`) REFERENCES `portal_accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `license_bundles_license_idx` ON `license_bundles` (`license_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `license_bundles_organization_idx` ON `license_bundles` (`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `license_bundles_generated_at_idx` ON `license_bundles` (`generated_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `licenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`license_id` text NOT NULL,
	`organization_id` integer NOT NULL,
	`status` text NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`seat_limit` integer NOT NULL,
	`label` text NOT NULL,
	`signed_bundle_version` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `licenses_license_id_unique` ON `licenses` (`license_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `licenses_organization_idx` ON `licenses` (`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `licenses_status_idx` ON `licenses` (`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_type` text NOT NULL,
	`country` text DEFAULT 'United States' NOT NULL,
	`state` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`domain` text,
	`research_field` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`deactivated_at` text,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organizations_domain_unique` ON `organizations` (`domain`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `organizations_email_idx` ON `organizations` (`email`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `organizations_status_idx` ON `organizations` (`status`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `portal_account_organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `portal_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `portal_account_organizations_account_org_unique` ON `portal_account_organizations` (`account_id`,`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_account_organizations_org_idx` ON `portal_account_organizations` (`organization_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `portal_account_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`portal_account_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`purpose` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_by_admin_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`portal_account_id`) REFERENCES `portal_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `portal_account_reset_tokens_hash_unique` ON `portal_account_reset_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_account_reset_tokens_account_idx` ON `portal_account_reset_tokens` (`portal_account_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_account_reset_tokens_org_idx` ON `portal_account_reset_tokens` (`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_account_reset_tokens_expires_idx` ON `portal_account_reset_tokens` (`expires_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `portal_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`must_change_password` integer DEFAULT true NOT NULL,
	`setup_completed_at` text,
	`failed_login_count` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `portal_accounts_email_unique` ON `portal_accounts` (`email`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_accounts_active_idx` ON `portal_accounts` (`active`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `portal_machine_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`service_account_id` integer NOT NULL,
	`key_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`revoked_at` text,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_account_id`) REFERENCES `portal_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `portal_machine_credentials_key_hash_unique` ON `portal_machine_credentials` (`key_hash`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `portal_machine_credentials_organization_idx` ON `portal_machine_credentials` (`organization_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `seats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seat_id` text NOT NULL,
	`organization_id` integer NOT NULL,
	`license_id` integer NOT NULL,
	`email` text,
	`roles_json` text,
	`status` text NOT NULL,
	`invite_token_hash` text,
	`invite_expires_at` text,
	`invite_accepted_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`license_id`) REFERENCES `licenses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `seats_seat_id_unique` ON `seats` (`seat_id`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `seats_invite_token_hash_unique` ON `seats` (`invite_token_hash`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `seats_organization_idx` ON `seats` (`organization_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `seats_license_idx` ON `seats` (`license_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `seats_status_idx` ON `seats` (`status`);