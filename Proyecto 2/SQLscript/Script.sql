DROP TABLE IF EXISTS TEMPERATURE;
DROP TABLE IF EXISTS METHANE;
DROP TABLE IF EXISTS STATUS;

CREATE TABLE IF NOT EXISTS TEMPERATURE (
	ID SERIAL PRIMARY KEY,
	VALUE DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS METHANE (
	ID SERIAL PRIMARY KEY,
	VALUE DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS STATUS (
	ID SERIAL PRIMARY KEY,
	Valve BOOLEAN NOT NULL,
	Spark BOOLEAN NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

INSERT INTO STATUS (Valve, Spark) VALUES (false, false);