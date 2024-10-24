-- Database: test_projet

-- DROP DATABASE IF EXISTS test_projet;

CREATE DATABASE test_projet
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


	CREATE TABLE Orleans(
		id_orleans SERIAL PRIMARY KEY,
		nom VARCHAR(100),
		adresse VARCHAR(100),
		type_espace VARCHAR(100),
		nombre_personne INT
	);
	
	CREATE TABLE Paris(
		id_paris SERIAL PRIMARY KEY,
		nom VARCHAR(100),
		adresse VARCHAR(100),
		type_espace VARCHAR(100),
		nombre_personne INT
	);

	CREATE TABLE Lyon(
		id_lyon SERIAL PRIMARY KEY,
		nom VARCHAR(100),
		adresse VARCHAR(100),
		type_espace VARCHAR(100),
		nombre_personne INT
	);

	CREATE TABLE Users(
		id_users SERIAL PRIMARY KEY,
		prenom VARCHAR(100),
		nom VARCHAR(100),
		mail VARCHAR(100),
		mdp VARCHAR(100)
	);

	CREATE TABLE Contact(
		id_contact SERIAL PRIMARY KEY,
		add_contact VARChAR(100),
		mess TEXT
	);


	INSERT INTO Orleans(nom,adresse,type_espace,nombre_personne) VALUES
	('Salle des fêtes','3 Rues des Pétunia','extérieur',500),
	('Séminaire','15 Rues des Tulipes','interieur',100),
	('Soirée intégration','15 boulevard de bananes','interieur',700),
	('Soirée Halloween','30 Rues des Jacinthes','extérieur',50),
	('Soirée Noël','3 Rues des roux','extérieur',350);

	INSERT INTO Lyon(nom,adresse,type_espace,nombre_personne) VALUES
	('Salle des fêtes','3 Rues des Pétunia','extérieur',500),
	('Séminaire','15 Rues des Tulipes','interieur',100),
	('Soirée intégration','15 boulevard de bananes','interieur',700),
	('Soirée Halloween','30 Rues des Jacinthes','extérieur',50),
	('Soirée Noël','3 Rues des roux','extérieur',350);


	INSERT INTO Paris(nom,adresse,type_espace,nombre_personne) VALUES
	('Salle des fêtes','3 Rues des Pétunia','extérieur',500),
	('Séminaire','15 Rues des Tulipes','interieur',100),
	('Soirée intégration','15 boulevard de bananes','interieur',700),
	('Soirée Halloween','30 Rues des Jacinthes','extérieur',50),
	('Soirée Noël','3 Rues des roux','extérieur',350);


	SELECT * FROM Orleans;
	

	SELECT * FROM Orleans;

	SELECT * FROM Paris;


	