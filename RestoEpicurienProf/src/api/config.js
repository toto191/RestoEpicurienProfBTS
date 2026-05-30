import axios from "axios";

const api = axios.create({
  // L'URL complète vers ton dossier contenant index.php
  //baseURL: "http://127.0.0.1/Tom/ProjetBTS/api/index.php",
  baseURL: "https://restolefestinepicurienprojetbts2.alwaysdata.net/index.php",
});

export default api;
