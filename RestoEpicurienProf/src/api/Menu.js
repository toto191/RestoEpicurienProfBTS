import api from "./config";

// Tente cette syntaxe plus explicite
export const getMenu = async (filtre = 0) => {
  try {
    const response = await api.get("?resource=menu", {
      params: {
        filtre: filtre,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur GET menu:", error);
    throw error;
  }
};

export const createMenu = async (createMenuData) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await api.post("?resource=menu", createMenuData, {
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

export const updateMenu = async (id, tableData) => {
  // 1. Récupérer le jeton stocké lors du login
  const token = localStorage.getItem("userToken");
  try {
    const response = await api.put(
      "?resource=menu",
      {
        ...tableData, // ← Copie TOUTES les propriétés
        id_table: id,
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

export const deleteMenu = async (id) => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await api.delete("?resource=menu", {
      data: { id },
      headers: {
        //  Attention à l'espace après Bearer !
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur DELETE menu:", error);
    throw error;
  }
};
