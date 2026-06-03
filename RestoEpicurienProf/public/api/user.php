<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// Dans ton fichier PHP qui gère le login
require_once 'config.php';
use Firebase\JWT\JWT;
function handleUtilisateurs($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            try {
                // On récupère les utilisateurs mais SANS leur mot de passe par sécurité
                // On fait une jointure pour avoir le nom du rôle au lieu de l'ID
                $sql = "SELECT u.email, u.nom, u.prenom, r.nom_role 
                    FROM Utilisateurs u 
                    JOIN Roles r ON u.id_role = r.id_role";
                $stmt = $pdo->query($sql);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } catch (PDOException $e) {
                // Si la base de données renvoie une erreur (ex: email déjà existant)
                http_response_code(500); //permet de dire au client que le serveur à échoué 
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
                exit;
            }
            break;

        case 'POST':
            try {
                // 1. Récupération des données avec valeurs par défaut pour éviter les erreurs
                $email = $input['email'] ?? null;
                $nom = $input['nom'] ?? null;
                $prenom = $input['prenom'] ?? null;
                $password = $input['password'] ?? null; // On utilise 'password' comme dans console.log
                $id_role = 2; // ID par défaut pour "Client" (à vérifier dans ta table Roles)

                if (!$email || !$password) {
                    echo json_encode(["status" => "error", "message" => "Email ou password manquant"]);
                    exit;
                }

                // 2. Hachage du mot de passe
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                // 3. Préparation de la requête 
                $sql = "INSERT INTO Utilisateurs (email, mot_de_passe, nom, prenom, id_role) VALUES (?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);

                $stmt->execute([$email, $hashedPassword, $nom, $prenom, $id_role]);

                // 4. RÉPONSE INDISPENSABLE POUR REACT
                echo json_encode([
                    "status" => "success",
                    "message" => "Utilisateur créé",
                    "id" => $pdo->lastInsertId()
                ]);
                exit;

            } catch (PDOException $e) {
                // Si la base de données renvoie une erreur (ex: email déjà existant)
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
                exit;
            }
            break;

        case 'PUT':
            // Mise à jour (si un mot de passe est fourni, on le met à jour aussi)
            if (!empty($input['mot_de_passe'])) {
                $sql = "UPDATE Utilisateurs SET email=?, mot_de_passe=?, nom=?, prenom=?, id_role=? WHERE id_utilisateur=?";
                $hashedPassword = password_hash($input['mot_de_passe'], PASSWORD_BCRYPT);
                $params = [$input['email'], $hashedPassword, $input['nom'], $input['prenom'], $input['id_role'], $input['id_utilisateur']];
            } else {
                $sql = "UPDATE Utilisateurs SET email=?, nom=?, prenom=?, id_role=? WHERE id_utilisateur=?";
                $params = [$input['email'], $input['nom'], $input['prenom'], $input['id_role'], $input['id_utilisateur']];
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(["status" => "updated"]);
            break;

        case 'DELETE':
            $stmt = $pdo->prepare("DELETE FROM Utilisateurs WHERE id_utilisateur = ?");
            $stmt->execute([$input['id_utilisateur']]);
            echo json_encode(["status" => "deleted"]);
            break;
    }
}




function handleLogin($method, $pdo, $input)
{
    if ($method !== 'POST')
        return;

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    // 1. Chercher l'utilisateur
    $stmt = $pdo->prepare("SELECT u.*, r.nom_role FROM Utilisateurs u 
                           JOIN Roles r ON u.id_role = r.id_role 
                           WHERE u.email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Vérifier le mot de passe
    if ($user && password_verify($password, $user['mot_de_passe'])) {



        // On définit l'expiration (Heure actuelle + 2 heures = 2*3600)
        $expireAt = time() + (2 * 3600);

        $payload = [
            "user_id" => $user['id_utilisateur'],
            "email" => $user['email'],
            "role" => $user['nom_role'],
            "exp" => $expireAt
        ];

        // Exemple de ce qu'il doit y avoir dans le login.php
        $_SESSION['user_id'] = $user['id_utilisateur']; // L'ID numérique
        $_SESSION['role'] = $user['nom_role']; // 'admin' ou 'user'

        // Encodage en Base64 avec JWT et signature
        $token = JWT::encode($payload, JWT_SECRET, 'HS256');

        echo json_encode([
            "status" => "success",
            "token" => $token,
            "expires_at" => $expireAt, // On renvoie aussi la date brute pour React
            "user" => [
                "numero" => $user['id_utilisateur'],
                "nom" => $user['nom'],
                "prenom" => $user['prenom'],
                "role" => $user['nom_role'],
                "email" => $user['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Identifiants invalides"]);
    }
}


function getAuthUserId(): int
{
    $authHeader = getallheaders()['Authorization'] ?? null;
    $token = $authHeader ? substr($authHeader, 7) : null; //Le 7 correspond au nombre de caractères de la chaîne "Bearer " (avec l'espace). car sinon on a Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI... en token

    try {
        return \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key(JWT_SECRET, 'HS256'))->user_id;
        /*
        La méthode decode() de la librairie Firebase JWT :

        décode le JWT
        vérifie la signature
        vérifie l'expiration (exp)
        renvoie les données du payload
        */
    } catch (Exception) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Token invalide ou manquant"]);
        exit;
    }
}



function PasserAdmin($method, $pdo, $input)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Méthode non autorisée"]);
        exit;
    }
    // 1. Récupérer tous les entêtes de la requête HTTP
    // 1. On vérifie si l'utilisateur a une session active et un ID stocké
    // Grâce au session_start() au tout début de ton fichier, $_SESSION est accessible
    $idUtilisateurConnecte = getAuthUserId();

    if (!$idUtilisateurConnecte) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Non connecté (Session introuvable ou expirée)"]);
        exit;
    }

    $mdpAdmin = $input['mdpadmin'] ?? null;

    if ($mdpAdmin !== MdpPasseAdmin) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Mot de passe Admin incorrect"]);
        exit;
    }
    // 3. Requête préparée SQL pour mettre à jour le rôle de l'utilisateur
    try {
        // On modifie la table Utilisateurs pour changer son id_role à 1 (Admin)
        $sql = "UPDATE Utilisateurs SET id_role = 1 WHERE id_utilisateur = ?";
        $stmt = $pdo->prepare($sql); //protège des inj sql 
        $stmt->execute([$idUtilisateurConnecte]); // Le paramètre est lié ici en toute sécurité

        echo json_encode([
            "status" => "success",
            "message" => "Félicitations, vous êtes désormais Admin ! Veuillez vous reconnecter pour mettre à jour votre token."
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Erreur BDD : " . $e->getMessage()]);
    }

}