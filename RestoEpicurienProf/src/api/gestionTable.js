import api from "./config";

export const getGestionTables = async () => {
  try {
    const reponse = await api.get("?resource=tables_resto");
    return reponse.data;
  } catch (error) {
    console.error("Erreur GET gestion tables", error);
    throw error;
  }
};

// POST : ajoute/supprime  une nouvel table
export const postGestionTables = async (gestionTables) => {
  try {
    const reponse = await api.post("?resource=tables_resto", gestionTables);
    return reponse.data;
  } catch (error) {
    console.error("Erreur POST gestion table:", error);
    throw error;
  }
};

export const deleteTable = async (id) => {
  try {
    const response = await api.delete("?resource=tables_resto", {
      data: { id_table: id },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur DELETE reservation:", error);
    throw error;
  }
};

// PUT : Modifier une réservation
export const updateTables = async (id, tableData) => {
  try {
    const response = await api.put("?resource=tables_resto", {
      ...tableData, // ← Copie TOUTES les propriétés
      id_table: id,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur PUT reservation:", error);
    throw error;
  }
};
