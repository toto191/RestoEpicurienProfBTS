<?php


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Headers pour autoriser React (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'reservation.php';
require_once 'gestionTable.php';
require_once 'user.php';
require_once 'menu.php';
require_once 'creneaux.php';
require_once 'config.php';
require_once 'status.php';

// Gestion du Preflight (Axios)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


// 2. Connexion à la BDD
$host = "";
$db_name = ""; // 
$username = "";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Connexion échouée : " . $e->getMessage()]);
    exit();
}


// 4. Récupérer les données de la requête
$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

// 5. Router la requête
switch ($resource) {
    case 'reservations':
        if (in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
            $tokenInfos = obtenirInfosToken();

            // On extrait le rôle ("client" ou "admin")
            $roleUser = $tokenInfos['role'] ?? '';

            // Rôles autorisés pour les réservations
            $rolesAutorises = ['client', 'admin'];

            // Si le token est invalide OU si le rôle n'est pas autorisé
            if (!$tokenInfos || !in_array($roleUser, $rolesAutorises)) {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Accès refusé : Connexion requise."]);
                exit();
            }
        }

        // Tout est OK ! On transmet les données au fichier reservation.php
        handleReservations($method, $pdo, $input);
        break;

    /*  case 'tables_resto':
          handleTables($method, $pdo, $input);
          break;
  */
    case 'utilisateurs':
        if (in_array($method, ['PUT', 'DELETE'])) {
            $tokenInfos = obtenirInfosToken();
            $roleUser = $tokenInfos['role'] ?? '';
            $rolesAutorises = ['client', 'admin'];

            // Si le token est invalide OU si le rôle de l'utilisateur n'est pas dans la liste autorisée
            if (!$tokenInfos || !in_array($roleUser, $rolesAutorises)) {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Accès refusé : Droits administrateur requis."]);
                exit(); // On arrête TOUT ici, handleMenu ne sera jamais lu !
            }
        }
        handleUtilisateurs($method, $pdo, $input);
        break;
    case 'menu':
        // SÉCURITÉ : Bloquer le POST, PUT et DELETE si pas Admin
        if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
            $tokenInfos = obtenirInfosToken();
            $roleUser = $tokenInfos['role'] ?? '';
            $rolesAutorises = ['admin'];

            // Si le token est invalide OU si le rôle de l'utilisateur n'est pas dans la liste autorisée
            if (!$tokenInfos || !in_array($roleUser, $rolesAutorises)) {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Accès refusé : Droits administrateur requis."]);
                exit(); // On arrête TOUT ici, handleMenu ne sera jamais lu !
            }
        }
        // Si c'est un GET, ou si le token est valide -> on laisse passer
        handleMenu($method, $pdo, $input);
        break;


    case 'login':
        handleLogin($method, $pdo, $input);
        break;
    case 'creneaux':
        handleCrenaux($method, $pdo, $input);
        break;
    case 'status':
        handleStatus($method, $pdo, $input);
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Ressource non trouvée"]);
        break;
}