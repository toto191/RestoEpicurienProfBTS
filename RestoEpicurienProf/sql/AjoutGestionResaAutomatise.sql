-- 1. Référentiel des jours de la semaine (remplace Jours_fermeture)
CREATE TABLE IF NOT EXISTS Jours_semaine (
    jour_semaine TINYINT PRIMARY KEY,
    -- 1=Lundi ... 7=Dimanche
    libelle VARCHAR(20) NOT NULL,
    est_ouvert TINYINT(1) NOT NULL DEFAULT 0
);
INSERT INTO Jours_semaine (jour_semaine, libelle, est_ouvert)
VALUES (1, 'Lundi', 0),
    -- Fermé
    (2, 'Mardi', 1),
    (3, 'Mercredi', 1),
    (4, 'Jeudi', 1),
    (5, 'Vendredi', 1),
    (6, 'Samedi', 1),
    (7, 'Dimanche', 0);
-- Fermé
-- 2. Créneaux de service (lié à Jours_semaine)
CREATE TABLE IF NOT EXISTS Creneaux (
    id_creneau INT PRIMARY KEY AUTO_INCREMENT,
    jour_semaine TINYINT NOT NULL,
    service VARCHAR(10) NOT NULL,
    -- 'midi' ou 'soir'
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    est_actif TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE KEY uq_creneau (jour_semaine, service),
    CONSTRAINT fk_creneau_jour FOREIGN KEY (jour_semaine) REFERENCES Jours_semaine(jour_semaine)
);
INSERT INTO Creneaux (jour_semaine, service, heure_debut, heure_fin)
VALUES (2, 'midi', '12:00:00', '14:30:00'),
    (3, 'midi', '12:00:00', '14:30:00'),
    (4, 'midi', '12:00:00', '14:30:00'),
    (4, 'soir', '19:30:00', '22:00:00'),
    (5, 'midi', '12:00:00', '14:30:00'),
    (5, 'soir', '19:30:00', '22:00:00'),
    (6, 'soir', '19:30:00', '22:30:00');
-- 3. Durées de service selon le nombre de couverts (inchangée)
CREATE TABLE IF NOT EXISTS Durees_service (
    id_duree INT PRIMARY KEY AUTO_INCREMENT,
    nb_personnes_min TINYINT NOT NULL,
    nb_personnes_max TINYINT NOT NULL,
    duree_minutes SMALLINT NOT NULL,
    CONSTRAINT chk_ordre CHECK (nb_personnes_min <= nb_personnes_max)
);
INSERT INTO Durees_service (
        nb_personnes_min,
        nb_personnes_max,
        duree_minutes
    )
VALUES (2, 3, 105),
    (4, 6, 150),
    (7, 8, 180),
    (9, 10, 210),
    (11, 99, 240);
-- 4. Disponibilité par créneau + table + date
--    Reliée à Reservation_Tables pour savoir quelle table est physiquement occupée
CREATE TABLE IF NOT EXISTS Dispo_Creneaux (
    id_dispo INT PRIMARY KEY AUTO_INCREMENT,
    id_creneau INT NOT NULL,
    id_table INT NOT NULL,
    date_dispo DATE NOT NULL,
    est_disponible TINYINT(1) NOT NULL DEFAULT 1,
    heure_fin_prevue TIME DEFAULT NULL,
    id_reservation INT DEFAULT NULL,
    UNIQUE KEY uq_dispo (id_creneau, id_table, date_dispo),
    CONSTRAINT fk_dispo_creneau FOREIGN KEY (id_creneau) REFERENCES Creneaux(id_creneau),
    CONSTRAINT fk_dispo_table FOREIGN KEY (id_table) REFERENCES Tables_Resto(id_table),
    CONSTRAINT fk_dispo_reservation FOREIGN KEY (id_reservation) REFERENCES Reservations(id_reservation) ON DELETE
    SET NULL
);
-- 5. Ajout de id_creneau sur Reservations (seule modification d'une table existante)
ALTER TABLE Reservations
ADD COLUMN id_creneau INT DEFAULT NULL
AFTER id_statut,
    ADD CONSTRAINT fk_res_creneau FOREIGN KEY (id_creneau) REFERENCES Creneaux(id_creneau);