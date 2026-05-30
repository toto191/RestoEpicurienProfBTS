<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Dans ton fichier PHP qui gère le login
require_once 'config.php';
function handleStatus($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            try {
                // On récupère les utilisateurs mais SANS leur mot de passe par sécurité
                // On fait une jointure pour avoir le nom du rôle au lieu de l'ID
                $sql = "SELECT id_statut, libelle
                    FROM Statuts  
                    ";
                $stmt = $pdo->query($sql);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } catch (PDOException $e) {
                // Si la base de données renvoie une erreur (ex: email déjà existant)
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
                exit;
            }
            break;

    }
}