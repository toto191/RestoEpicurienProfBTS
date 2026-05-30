<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'config.php';

function handleMenu($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            // On récupère le filtre depuis l'URL (ex: ?resource=menu&filtre=1)
            // On force la conversion en entier (int) pour la sécurité
            $valeurFiltre = isset($_GET['filtre']) ? (int) $_GET['filtre'] : 0;



            $sql = "SELECT * FROM menu WHERE est_a_la_carte >= ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$valeurFiltre]);

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            // Ajout d'un nouveau plat ou d'une nouvelle formule
            $sql = "INSERT INTO menu (nom, entree, plat, dessert, prix, est_a_la_carte) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $input['nom'],
                $input['entree'] ?? null, // Utilise null si le champ est vide
                $input['plat'] ?? null,
                $input['dessert'] ?? null,
                $input['prix'],
                $input['est_a_la_carte'] // 0 pour Menu, 1 pour Carte
            ]);

            echo json_encode([
                "status" => "success",
                "id" => $pdo->lastInsertId(),
                "message" => "Élément ajouté au menu"
            ]);
            break;

        case 'PUT':
            // Mise à jour d'un élément existant
            $sql = "UPDATE menu SET nom=?, entree=?, plat=?, dessert=?, prix=?, est_a_la_carte=? WHERE id=?";
            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                $input['nom'],
                $input['entree'],
                $input['plat'],
                $input['dessert'],
                $input['prix'],
                $input['est_a_la_carte'],
                $input['id'] // L'ID envoyé par React
            ]);

            echo json_encode(["status" => "updated", "message" => "Menu mis à jour"]);
            break;

        case 'DELETE':
            // 1. On vérifie si l'ID est bien présent
            if (!isset($input['id']) || empty($input['id'])) {
                http_response_code(400); // Erreur client
                echo json_encode(["status" => "error", "message" => "ID manquant"]);
                break;
            }

            $stmt = $pdo->prepare("DELETE FROM menu WHERE id = ?");
            $stmt->execute([$input['id']]);

            // 2. On vérifie si une ligne a vraiment été impactée
            if ($stmt->rowCount() > 0) {
                echo json_encode(["status" => "deleted", "message" => "Élément supprimé"]);
            } else {
                http_response_code(404); // Non trouvé
                echo json_encode(["status" => "error", "message" => "Aucun menu trouvé avec cet ID"]);
            }
            break;
    }
}