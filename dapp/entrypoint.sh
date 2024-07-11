#!/bin/sh
# Wait until PostgreSQL is ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h blocktrek-database -U test -d blocktrek; do
  sleep 4
done

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev

# Start the Next.js application
echo "Starting Next.js..."
exec "$@"
