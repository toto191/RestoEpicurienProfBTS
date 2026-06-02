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
-- 5. Ajout de id_creneau sur Reservations (seule modification d'une table existante)
ALTER TABLE Reservations
ADD COLUMN id_creneau INT DEFAULT NULL
AFTER id_statut,
    ADD CONSTRAINT fk_res_creneau FOREIGN KEY (id_creneau) REFERENCES Creneaux(id_creneau);