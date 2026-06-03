// src/authContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();

    // On récupère l'user au chargement initial ICI
    useEffect(() => {
            const savedUser = localStorage.getItem("userData");
            if (savedUser) {
                setUser(JSON.parse(savedUser)); //permet de ne pas oublier l'utilisateur à chaque rafraichissement de page 
            }

    }, []); // pour recharger le local storate a chaque ofis qu'il évolue 


/*
    const verifySession = () => {
        const savedUser = localStorage.getItem("userData");
        
        if (savedUser && !checkTokenExpiration()) {
            setUser(JSON.parse(savedUser));
            console.log("Session valide, utilisateur connecté.");
            return true; // La session est toujours bonne
        } else {
            console.log("Session expirée ou inexistante, nettoyage...");
            handleLogout();
            return false; // La session a expiré
        }
    };*/

    const verifySession = () => {
    try {
        const savedUser = localStorage.getItem("userData");

        if (savedUser && !checkTokenExpiration()) {
            setUser(JSON.parse(savedUser));
            return true;
        } else {
            handleLogout();
            return false;
        }
    } finally {
        setLoadingAuth(false);
    }
};

     const checkTokenExpiration = () => { //plutard mettre dans authcontext.jsx pour pouvoir l'utiliser dans tous les composants
    
    if (!localStorage.getItem("tokenExpiration")) return true;
    try {
         const exp = localStorage.getItem("tokenExpiration");
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
        return exp < now; // Renvoie true si expiré
    } catch (e) {
        return true; // En cas d'erreur, on considère expiré par sécurité
    }
};

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setUser(null); // On remet l'état à null pour faire réapparaître le formulaire
        alert("Vous êtes déconnecté.");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser,verifySession ,loadingAuth}}> //permet de réutiliser ça dans les page utilisant authContext
            {children}
        </AuthContext.Provider>
    );
};