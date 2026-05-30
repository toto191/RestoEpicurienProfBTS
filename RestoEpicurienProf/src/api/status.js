import api from "./config";

// GET : Récupérer toutes les réservations / async parce que les appels API prennent du temps
export const getStatus = async () => {
  try {
    const response = await api.get("?resource=status");
    return response.data;
  } catch (error) {
    console.error("Erreur GET status:", error);
    throw error;
  }
};

