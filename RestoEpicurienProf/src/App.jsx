import React, { useState, useContext, useEffect } from 'react'; // Ajout de useEffect
import ReservationForm from './components/resa/ReservationForm';
import Menu from './components/menu/Menu';
import Header from './components/header/header.jsx';
import Login from './components/login/Login.jsx';
import CreateMenu from './components/CreationMenu/createMenu.jsx';
import MenuCarte from './components/MenuCarte/menu-carte.jsx';
import UpdateMenu from'./components/UpdateMenu/updateMenu.jsx';
import GestionResa from './components/GestionResa/gestionResa.jsx';
import { AuthContext } from "./authContext.jsx"; // Import du contexte pour gérer l'authentification

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext.jsx"; 
import './App.css'

function App() {

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    setUser(null);
  };

  const checkTokenExpiration = () => {
    return false; 
  };


  return (
    // On enveloppe TOUT dans le Provider pour que useContext fonctionne ailleurs
    <AuthProvider>
      <header>
        <Header />
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/reservation" element={<ReservationForm />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/create-menu" element={<CreateMenu/>}/>
          <Route path="/menu-carte" element={<MenuCarte/>}/>
          <Route path="/update-menu" element={<UpdateMenu/>}/>
          <Route path="/gestion-resa" element={<GestionResa/>}/>
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;