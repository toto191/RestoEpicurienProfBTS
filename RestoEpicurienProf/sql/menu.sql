CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    entree TEXT,
    plat TEXT,
    dessert TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    est_a_la_carte TINYINT(1) NOT NULL DEFAULT 1
);