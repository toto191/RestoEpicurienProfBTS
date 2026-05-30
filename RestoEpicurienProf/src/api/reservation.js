import api from "./config";

// GET : Récupérer toutes les réservations / async parce que les appels API prennent du temps
export const getReservations = async () => {
  const token = localStorage.getItem("userToken");

  try {
    const response = await api.get("?resource=reservations", {
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur GET reservations:", error);
    throw error;
  }
};

export const getReservationsByID = async (id, role) => {
  const token = localStorage.getItem("userToken");

  try {
    // On passe l'id et le role dans l'URL via l'objet params
    //  console.log("id et role envoyés au backend : ", id, role);
    const response = await api.get(`?resource=reservations`, {
      params: {
        id_user: id,
        role: role,
      },
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur GET reservations:", error);
    throw error;
  }
};
// POST : Créer une nouvelle réservation avec plusieurs tables
export const createReservation = async (reservationData) => {
  const token = localStorage.getItem("userToken");

  try {
    const response = await api.post("?resource=reservations", reservationData, {
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur POST reservation:", error);
    throw error;
  }
};

// Exemple de données attendues :
// {
//   id_client: 5,
//   date_reservation: "2026-01-10",
//   heure_reservation: "19:30",
//   nb_personnes: 4,
//   tables: [3, 7, 12]  // IDs des tables
// }

// DELETE : Supprimer une réservation
export const deleteReservation = async (id) => {
  const token = localStorage.getItem("userToken");

  try {
    const response = await api.delete("?resource=reservations", {
      data: { id_reservation: id },
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur DELETE reservation:", error);
    throw error;
  }
};

// PUT : Modifier une réservation
export const updateReservation = async (id, reservationData) => {
  const token = localStorage.getItem("userToken");

  try {
    const response = await api.put(
      "?resource=reservations",
      {
        ...reservationData, // ← Copie TOUTES les propriétés
        id_reservation: id,
      },
      {
        headers: {
          //  Attention à l'espace après Bearer !
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Erreur PUT reservation:", error);
    throw error;
  }
};
