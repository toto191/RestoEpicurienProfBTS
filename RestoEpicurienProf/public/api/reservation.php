<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'config.php';
function handleReservations($method, $pdo, $input)
{
    switch ($method) {
        case 'GET':
            // On vérifie si un id_utilisateur est passé en paramètre dans l'URL (ex: ?id_user=5)
            $id_user = $_GET['id_user'] ?? null;
            $role_connecte = $_GET['role'] ?? null;

            if ($id_user && $role_connecte == "client") {
                // Version filtrée par utilisateur
                $sql = "SELECT r.*, u.nom, u.prenom, s.libelle as statut_nom 
                            FROM Reservations r
                            LEFT JOIN Utilisateurs u ON r.id_utilisateur = u.id_utilisateur
                            JOIN Statuts s ON r.id_statut = s.id_statut
                            WHERE r.id_utilisateur = ?
                            ORDER BY r.date_reservation DESC, r.heure_reservation DESC";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id_user]);
            } elseif ($id_user && $role_connecte == "admin") {
                // Version globale (votre code actuel)
                $sql = "SELECT r.*, u.nom, u.prenom, s.libelle as statut_nom 
                            FROM Reservations r
                            LEFT JOIN Utilisateurs u ON r.id_utilisateur = u.id_utilisateur
                            JOIN Statuts s ON r.id_statut = s.id_statut
                            ORDER BY r.date_reservation DESC, r.heure_reservation DESC";

                $stmt = $pdo->query($sql);
            } else {

                http_response_code(403);

                echo json_encode([
                    "error" => "Accès refusé",
                    "role" => $role_connecte,
                    "id_user" => $id_user
                ]);

                exit;
            }

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            try {
                $pdo->beginTransaction();
                //file_put_contents('debug.txt', print_r($input, true));

                // --- ÉTAPE A : Insérer la réservation ---
                $sql = "INSERT INTO Reservations (id_utilisateur, id_statut, id_creneau, date_reservation, heure_reservation, nb_personnes) 
                        VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $input['id_utilisateur'],
                    $input['id_statut'] ?? 1, // par defaut en attente  
                    $input['id_creneau'],
                    $input['date_reservation'],
                    $input['heure_reservation'],
                    $input['nb_personnes']
                ]);

                // --- ÉTAPE B : Récupérer l'ID généré ---
                $id_reservation = $pdo->lastInsertId();

                // --- ÉTAPE C : Attribuer les tables ---
                if (!empty($input['tables']) && is_array($input['tables'])) {
                    $sqlTable = "INSERT INTO Reservation_Tables (id_reservation, id_table) VALUES (?, ?)";
                    $stmtTable = $pdo->prepare($sqlTable);

                    // --- ÉTAPE D : Bloquer le créneau pour chaque table ---
                    $sqlDispo = "INSERT INTO Dispo_Creneaux (id_creneau, id_table, date_dispo, est_disponible, heure_fin_prevue, id_reservation) 
                                VALUES (?, ?, ?, 0, ADDTIME(?, SEC_TO_TIME(? * 60)), ?)";
                    $stmtDispo = $pdo->prepare($sqlDispo);

                    foreach ($input['tables'] as $id_table) {
                        // On lie la table à la réservation
                        $stmtTable->execute([$id_reservation, $id_table]);

                        // On rend la table indisponible (Étape D de ton script)
                        $stmtDispo->execute([
                            $input['id_creneau'],
                            $id_table,
                            $input['date_reservation'],
                            $input['heure_reservation'],
                            150, // Durée en minutes (2h30)
                            $id_reservation
                        ]);
                    }
                }

                $pdo->commit();
                header('Content-Type: application/json');
                echo json_encode(["status" => "success", "id_reservation" => $id_reservation, "message" => "La réservation à été enregistré"]);
                exit;
            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(["error" => "Erreur lors de la réservation : " . $e->getMessage()]);
            }
            break;

        case 'PUT':
            // Mise à jour : on change l'ID en id_reservation pour coller à ta PK
            $sql = "UPDATE Reservations 
                    SET id_utilisateur=?, date_reservation=?, heure_reservation=?, nb_personnes=?, id_statut=? 
                    WHERE id_reservation=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $input['id_utilisateur'],
                $input['date_reservation'],
                $input['heure_reservation'],
                $input['nb_personnes'],
                $input['id_statut'], // Permet de passer de 'En attente' à 'Confirmé'
                $input['id_reservation']
            ]);

            echo json_encode(["status" => "updated", "message" => "Réservation mise à jour"]);
            break;

        case 'DELETE':
            // Grâce au ON DELETE CASCADE, supprimer ici supprimera aussi dans Reservation_Tables
            $stmt = $pdo->prepare("DELETE FROM Reservations WHERE id_reservation = ?");
            $stmt->execute([$input['id_reservation']]);

            echo json_encode(["status" => "deleted", "message" => "Réservation supprimée"]);
            break;
    }
}