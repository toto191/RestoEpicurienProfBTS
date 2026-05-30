

CREATE TABLE IF NOT EXISTS Roles (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    nom_role VARCHAR(50) NOT NULL UNIQUE
) ;

INSERT INTO Roles (id_role, nom_role) VALUES (1, 'admin');
INSERT INTO Roles (id_role, nom_role) VALUES (2, 'client');

CREATE TABLE IF NOT EXISTS Utilisateurs (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    id_role INT NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES Roles(id_role)
) ;



CREATE TABLE IF NOT EXISTS Tables_Resto (
    id_table INT PRIMARY KEY AUTO_INCREMENT,
    numero_table INT NOT NULL UNIQUE,
    capacite INT NOT NULL,
    zone VARCHAR(50)
) ;

-- 1. Table de référence pour les statuts
CREATE TABLE IF NOT EXISTS Statuts (
    id_statut INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(30) NOT NULL UNIQUE -- 'En attente', 'Confirmé', 'Annulé', etc.
) ;

-- 2. Table Reservations mise à jour avec la clé étrangère
CREATE TABLE IF NOT EXISTS Reservations (
    id_reservation INT PRIMARY KEY AUTO_INCREMENT,
    id_utilisateur INT,
    id_statut INT NOT NULL DEFAULT 1, -- On lie l'ID du statut ici
    date_reservation DATE NOT NULL,
    heure_reservation TIME NOT NULL,
    nb_personnes INT NOT NULL,
    CONSTRAINT fk_res_user FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
    CONSTRAINT fk_res_statut FOREIGN KEY (id_statut) REFERENCES Statuts(id_statut)
) ;

CREATE TABLE IF NOT EXISTS Reservation_Tables (
    id_reservation INT,
    id_table INT,
    PRIMARY KEY (id_reservation, id_table),
    CONSTRAINT fk_link_res FOREIGN KEY (id_reservation) REFERENCES Reservations(id_reservation) ON DELETE CASCADE,
    CONSTRAINT fk_link_table FOREIGN KEY (id_table) REFERENCES Tables_Resto(id_table)
) ;

CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    entree TEXT,
    plat TEXT,
    dessert TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    est_a_la_carte TINYINT(1) NOT NULL DEFAULT 1
);

INSERT IGNORE INTO Statuts (libelle)
VALUES ("En attente"),
("Confirmé"),
("Annulé"),
("terminé");
