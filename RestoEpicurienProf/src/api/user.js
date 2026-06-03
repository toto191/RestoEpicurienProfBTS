import api from "./config";

export const createUser = async (userData) => {
  const token = localStorage.getItem("userToken");
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
  const token = localStorage.getItem("userToken");
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

export const PasserLogin = async (mdp) => {
  const token = localStorage.getItem("userToken");
  const response = await api.post(
    "?resource=PasserAdmin",
    { mdpadmin: mdp },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
