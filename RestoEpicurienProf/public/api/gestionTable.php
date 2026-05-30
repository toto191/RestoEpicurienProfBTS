<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'config.php';
function handleTables($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            // Récupère toutes les tables (ex: numéro de table, capacité)
            $stmt = $pdo->query("SELECT * FROM tables_resto ORDER BY numero_table ASC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            // Ajout d'une nouvelle table
            $sql = "INSERT INTO tables_resto (numero_table, capacite) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            // On vérifie si les données existent dans $input envoyé par Axios
            $stmt->execute([
                $input['numero_table'],
                $input['capacite']
            ]);
            echo json_encode([
                "status" => "success",
                "id" => $pdo->lastInsertId(),
                "message" => "Table ajoutée avec succès"
            ]);
            break;

        case 'PUT':
            // On utilise id_table car c'est le nom dans ton SQL
            $sql = "UPDATE Tables_Resto SET numero_table = ?, capacite = ? WHERE id_table = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $input['numero_table'],
                $input['capacite'],
                $input['id_table']
            ]);
            echo json_encode(["status" => "updated"]);
            break;

        case 'DELETE':
            // Correction du nom de la table et de la colonne
            $stmt = $pdo->prepare("DELETE FROM Tables_Resto WHERE id_table = ?");
            $stmt->execute([$input['id_table']]);
            echo json_encode(["status" => "deleted"]);
            break;
    }
}
