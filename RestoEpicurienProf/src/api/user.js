import api from "./config";
const token = localStorage.getItem("token");

export const createUser = async (userData) => {
  try {
    const response = await api.post("?resource=utilisateurs", userData, {
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur POST création:", error);
    throw error;
  }
};

export const LoginUser = async (userData) => {
  try {
    const response = await api.post("?resource=login", userData, {
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur POST login:", error);
    throw error;
  }
};
