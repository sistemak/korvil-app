-- K-AI SQL - Schema completo com JWT Auth
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE evolutions (
  id SERIAL PRIMARY KEY,
  prompt TEXT,
  language VARCHAR(50),
  code TEXT,
  nivel INT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password_hash) VALUES ('kai@korvil.ai', crypt('kai123', gen_salt('bf')));

-- JWT simulation table
CREATE TABLE jwt_tokens (
  token TEXT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  expires_at TIMESTAMP
);

SELECT 'K-AI SQL Online - 512 neurons' as status;