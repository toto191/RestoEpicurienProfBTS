<?php

define('JWT_SECRET', '');
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


function obtenirInfosToken()
{
    // 1. Essayer de récupérer le token par tous les moyens possibles
    $authHeader = null;

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['Redirect_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['Redirect_HTTP_AUTHORIZATION'];
    } else {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }

    if (!$authHeader) {
        return null; // Si toujours rien, c'est que le front n'envoie rien ou qu'Apache bloque
    }

    // 2. ICI on extrait le token (on vire "Bearer ") et on utilise la bibliothèque !
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];

        try {
            // REMPLACE PAR TA VRAIE CLÉ (La même que dans login.php)
            $secretKey = JWT_SECRET;

            // C'est ici que la bibliothèque firebase/php-jwt travaille :
            $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));

            // On transforme l'objet décodé en tableau PHP
            return (array) $decoded;

        } catch (Exception $e) {
            // Si le token a expiré ou est faux
            return null;
        }
    }

    return null;
}