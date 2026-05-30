// src/authContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On récupère l'user au chargement initial ICI
    useEffect(() => {
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []); // pour recharger le local storate a chaque ofis qu'il évolue 

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};