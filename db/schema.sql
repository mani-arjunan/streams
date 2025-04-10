CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name TEXT 
);

CREATE TABLE IF NOT EXISTS normalized_user (
  id SERIAL PRIMARY KEY,
  firstname TEXT,
  lastname TEXT 
);

