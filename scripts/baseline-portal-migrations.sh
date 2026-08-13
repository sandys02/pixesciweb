#!/usr/bin/env bash
# One-off bootstrap for the new generate+migrate workflow (Phase 12 durable fix).
#
# Both the Preview and Production portal databases already match the current
# schema.ts exactly (Preview from an earlier manual fix, Production from
# scripts/migrate-prod-seat-roles.sh) -- so drizzle/portal/0000_baseline_schema.sql
# must be marked as already-applied in each database's __drizzle_migrations
# bookkeeping table, NOT re-executed (re-running it would fail: the tables/columns
# it creates already exist).
#
# This replicates exactly what drizzle-orm's own libsql migrator does
# (node_modules/drizzle-orm/libsql/migrator.js): same table shape, same hash
# (sha256 of the migration file's raw bytes), same created_at (the journal's
# "when" timestamp) -- computed fresh from the actual file, never hardcoded.
#
# Safe to re-run: guarded by "only insert if the table is empty".

set -euo pipefail
cd "$(dirname "$0")/.."

MIGRATION_FILE="drizzle/portal/0000_baseline_schema.sql"
JOURNAL_FILE="drizzle/portal/meta/_journal.json"

if [ ! -f "$MIGRATION_FILE" ] || [ ! -f "$JOURNAL_FILE" ]; then
  echo "Missing $MIGRATION_FILE or $JOURNAL_FILE -- run 'npm run db:generate:portal' first." >&2
  exit 1
fi

read -r HASH FOLDER_MILLIS <<EOF
$(node -e "
const fs = require('fs');
const crypto = require('crypto');
const query = fs.readFileSync('$MIGRATION_FILE').toString();
const hash = crypto.createHash('sha256').update(query).digest('hex');
const journal = JSON.parse(fs.readFileSync('$JOURNAL_FILE').toString());
const entry = journal.entries.find(e => e.tag === '0000_baseline_schema');
console.log(hash, entry.when);
")
EOF

echo "hash=$HASH folderMillis=$FOLDER_MILLIS"

run_sql() {
  local host="$1" token="$2" sql="$3"
  local payload
  payload=$(python3 -c "import json,sys; print(json.dumps({'requests':[{'type':'execute','stmt':{'sql': sys.argv[1]}},{'type':'close'}]}))" "$sql")
  curl -s -X POST "https://${host}/v2/pipeline" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "$payload"
  echo
}

baseline_env() {
  local label="$1" host="$2" token="$3"
  echo "=== $label ($host) ==="

  run_sql "$host" "$token" "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id INTEGER PRIMARY KEY, hash text NOT NULL, created_at numeric)"

  echo "checking for existing baseline row..."
  local count_result
  count_result=$(run_sql "$host" "$token" "SELECT COUNT(*) FROM __drizzle_migrations")
  echo "$count_result"

  if echo "$count_result" | grep -q '"value":"0"'; then
    echo "inserting baseline row..."
    run_sql "$host" "$token" "INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('${HASH}', ${FOLDER_MILLIS})"
  else
    echo "already baselined, skipping insert."
  fi
  echo
}

PREVIEW_HOST=$(grep -E '^PORTAL_DATABASE_URL=' .env.local | cut -d= -f2- | sed 's#libsql://##')
PREVIEW_TOKEN=$(grep -E '^PORTAL_DATABASE_AUTH_TOKEN=' .env.local | cut -d= -f2-)
PROD_HOST=$(grep -E '^PORTAL_PRODUCTION_DATABASE_URL_HOST=' .env.local | cut -d= -f2-)
PROD_TOKEN=$(grep -E '^PROD_PORTAL_DATABASE_AUTH_TOKEN=' .env.local | cut -d= -f2-)

baseline_env "Preview" "$PREVIEW_HOST" "$PREVIEW_TOKEN"
baseline_env "Production" "$PROD_HOST" "$PROD_TOKEN"

echo "Done. Both databases should now show 1 row in __drizzle_migrations."
