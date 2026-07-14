#!/bin/sh
set -eu

mkdir -p /data
chown -R nextjs:nodejs /data

exec runuser -u nextjs -- "$@"
