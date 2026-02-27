CREATE DATABASE IF NOT EXISTS USE db_MyUnescoExploration
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE db_NAMEGOESHERE;
CREATE TABLE t_user(
   user_id INT AUTO_INCREMENT,
   nom VARCHAR(20) NOT NULL,
   email VARCHAR(20) NOT NULL,
   mot_de_passe VARCHAR(64) NOT NULL,
   PRIMARY KEY(user_id)
);

CREATE TABLE t_site(
   site_id INT AUTO_INCREMENT,
   nom VARCHAR(256) NOT NULL,
   categorie ENUM('Natural', 'Cultural', 'Mixed') NOT NULL
   region VARCHAR(64) NOT NULL,
   description VARCHAR(2048) NOT NULL,
   longitude DOUBLE NOT NULL,
   latitude DOUBLE NOT NULL,
   lien_image VARCHAR(128),
   PRIMARY KEY(site_id)
);

CREATE TABLE t_pays(
   pays_id INT AUTO_INCREMENT,
   nom VARCHAR(40) NOT NULL,
   PRIMARY KEY(pays_id),
   UNIQUE(nom)
);

CREATE TABLE t_avoir_visite(
   user_fk INT,
   pin_fk INT,
   PRIMARY KEY(user_fk, pin_fk),
   FOREIGN KEY(user_fk) REFERENCES t_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(pin_fk) REFERENCES t_site(site_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE t_vouloir_visiter(
   user_fk INT,
   pin_fk INT,
   couleur VARCHAR(50),
   PRIMARY KEY(user_fk, pin_fk),
   FOREIGN KEY(user_fk) REFERENCES t_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(pin_fk) REFERENCES t_site(site_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE t_appartenir_a(
   pin_fk INT,
   pays_fk INT,
   PRIMARY KEY(pin_fk, pays_fk),
   FOREIGN KEY(pin_fk) REFERENCES t_site(site_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(pays_fk) REFERENCES t_pays(pays_id) ON DELETE CASCADE ON UPDATE CASCADE
);
