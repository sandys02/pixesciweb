#!/usr/bin/env bash
# One-off, safe production migration for the Phase 1 seat-role expansion.
# Reads PROD-PORTAL_DATABASE_AUTH_TOKEN and PORTAL_PRODUCTION_DATABASE_URL_HOST
# from .env.local (same directory), so no secret is hardcoded here.
#
# What it does (all additive, nothing is dropped):
#   1. seats.roles_json TEXT column is added (existing seats.role column stays).
#   2. Every existing seat's roles_json is backfilled from its current role
#      (admin -> tenant_security_administrator, member -> analyst_technician),
#      the same mapping the app itself used before the legacy fallback was
#      removed -- so no seat's effective role changes.
#   3. The new portal_machine_credentials table + indexes are created.
#
# Safe to re-run: every statement is idempotent (IF NOT EXISTS / WHERE roles_json IS NULL).

set -euo pipefail
cd "$(dirname "$0")/.."

TOKEN=$(grep -E '^PROD-PORTAL_DATABASE_AUTH_TOKEN=' .env.local | cut -d= -f2-)
HOST=$(grep -E '^PORTAL_PRODUCTION_DATABASE_URL_HOST=' .env.local | cut -d= -f2-)

if [ -z "$TOKEN" ] || [ -z "$HOST" ]; then
  echo "Missing PROD-PORTAL_DATABASE_AUTH_TOKEN or PORTAL_PRODUCTION_DATABASE_URL_HOST in .env.local" >&2
  exit 1
fi

run_sql() {
  local sql="$1"
  local payload
  payload=$(python3 -c "import json,sys; print(json.dumps({'requests':[{'type':'execute','stmt':{'sql': sys.argv[1]}},{'type':'close'}]}))" "$sql")
  curl -s -X POST "https://${HOST}/v2/pipeline" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload"
  echo
}

echo "1/5 add roles_json column..."
run_sql "ALTER TABLE seats ADD COLUMN roles_json TEXT"

echo "2/5 backfill roles_json from legacy role..."
run_sql "UPDATE seats SET roles_json = CASE WHEN role = 'admin' THEN '[\"tenant_security_administrator\"]' WHEN role = 'member' THEN '[\"analyst_technician\"]' ELSE NULL END WHERE roles_json IS NULL"

echo "3/5 create portal_machine_credentials table..."
run_sql "CREATE TABLE IF NOT EXISTS portal_machine_credentials (id INTEGER PRIMARY KEY AUTOINCREMENT, organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, service_account_id INTEGER NOT NULL REFERENCES portal_accounts(id) ON DELETE CASCADE, key_hash TEXT NOT NULL, created_at TEXT NOT NULL, revoked_at TEXT)"

echo "4/5 create unique index on key_hash..."
run_sql "CREATE UNIQUE INDEX IF NOT EXISTS portal_machine_credentials_key_hash_unique ON portal_machine_credentials(key_hash)"

echo "5/5 create organization_id index..."
run_sql "CREATE INDEX IF NOT EXISTS portal_machine_credentials_organization_idx ON portal_machine_credentials(organization_id)"

echo
echo "Verifying: seats with roles_json populated vs total..."
run_sql "SELECT COUNT(*) AS total, SUM(CASE WHEN roles_json IS NOT NULL THEN 1 ELSE 0 END) AS with_roles FROM seats"
