import api from "./config";

export const getCrenaux = async () => {
  const token = localStorage.getItem("token");
  try {
    const reponse = await api.get("?resource=creneaux", {
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return reponse.data;
  } catch (error) {
    console.error("Erreur GET affichage des creneaux", error);
    throw error;
  }
};
