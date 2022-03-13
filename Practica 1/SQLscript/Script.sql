DROP TABLE IF EXISTS Temp_Pozo;
DROP TABLE IF EXISTS Temp_Casa;
DROP TABLE IF EXISTS Luz;
DROP TABLE IF EXISTS Humedad;
DROP TABLE IF EXISTS CO2;

CREATE TABLE IF NOT EXISTS Temp_Pozo(
	ID SERIAL PRIMARY KEY,
	Temperatura DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Temp_Casa(
	ID SERIAL PRIMARY KEY,
	Temperatura DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Luz(
	ID SERIAL PRIMARY KEY,
	Nivel DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Humedad(
	ID SERIAL PRIMARY KEY,
	Nivel DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS CO2(
	ID SERIAL PRIMARY KEY,
	Nivel DECIMAL NOT NULL,
	Timestamp TIMESTAMP DEFAULT NOW()
);