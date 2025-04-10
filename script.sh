#!/bin/bash

export PGPASSWORD=password

set -e

echo "Database is up. Inserting data..."

generate_data() {
  psql -h db -U mani -d test -c "
    INSERT INTO \"user\" (name)
    SELECT 
      initcap(substr(md5(random()::text), 1, 5)) || ' ' || 
      initcap(substr(md5(random()::text), 1, 5))
    FROM generate_series(1, 100000);
  "
}

while true; do
  generate_data
  size=$(psql -h db -U mani -d test -t -c "SELECT pg_total_relation_size('\"user\"');" | xargs)
  echo "Current user table size: $((size / 1024 / 1024)) MB"
  if (( size >= 500 * 1024 * 1024 )); then
    echo "Reached ~500MB. Done."
    break
  fi
done

