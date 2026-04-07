#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "  Database not ready yet, retrying in 2s..."
  sleep 2
done

echo "Running database migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  npm run db:seed
fi

echo "Migrations complete. Starting server..."
exec "$@"
