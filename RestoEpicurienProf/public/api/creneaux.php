<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'config.php';
function handleCrenaux($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            // Récupère toutes les tables (ex: numéro de table, capacité)
            $stmt = $pdo->query("SELECT * FROM Creneaux ");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
    }
}