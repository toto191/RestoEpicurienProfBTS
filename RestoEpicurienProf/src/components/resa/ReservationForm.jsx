import React, { useState, useContext,useEffect } from 'react';
import { createReservation } from '../../api/reservation.js';
import { Link, useNavigate } from "react-router-dom";
import './Reservation.css';
import { AuthContext } from "../../authContext.jsx";
import { data } from 'react-router-dom';
import {getCrenaux} from "../../api/crenaux.js"



function ReservationForm() {

    const { user,setUser,verifySession,loadingAuth} = useContext(AuthContext); // Accès direct !
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
     useEffect(()=>{
        verifySession(); //nous indique si on est déco ou non 
    },[]);

    

    const [formData, setFormData] = useState({ //data envoyé pour faire une résa 
        id_utilisateur: user?.numero || '',
        date_reservation: '',
        heure_reservation: '',
        nb_personnes: 2,
        id_creneau: '',
    });

  
    const [selectedTables, setSelectedTables] = useState([]);
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        
         if (loading) return; // ← bloque si déjà en cours
        setLoading(true);
  
        
        try {
            const data = {
                ...formData
            };
            data.id_utilisateur = user?.numero;

            console.log("Données envoyées au serveur :", data);
            
            const response = await createReservation(data);
            setMessage('✅ ' + response?.data?.message);
            
            
            // Réinitialiser le formulaire
            setFormData({
                id_utilisateur: user?.numero || '',
                date_reservation: '',
                heure_reservation: '',
                nb_personnes: 2,
                id_creneau: '',
            });
            setSelectedTables([]);
            
        } catch (error) {
            setMessage('❌ Erreur : ' + (error.response?.data?.message || 'Erreur serveur'));
            // Dans ton catch ou après l'appel
            console.log("Réponse serveur :", error.response?.data);
            console.log("Payload envoyé :", data); // ce que tu envoies
        } finally {
        setLoading(false); // ← toujours débloqué à la fin
    }
    };




    // -----------------------------------Partie creneaux-----------------------------
     

    const [listeCreneaux, setListeCreneaux] = useState([]);

    // Tu copies la fonction ici pour qu'elle appartienne à ce composant
    const chargerMesCreneaux = async () => {
        try {
            const result = await getCrenaux();
            setListeCreneaux(result); 
            
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        chargerMesCreneaux();       
    },[]); //[] signifie une fois au démarage 

    const trouverCreneauAuto = (dateStr, heureStr) => {
        if (!dateStr || !heureStr || listeCreneaux.length === 0) return;

        // 1. Trouver le jour de la semaine (0-6)
        const dateObj = new Date(dateStr + "T00:00:00"); // T00... permet de mettre au format UTC universel
        const jourChoisi = dateObj.getDay();

        // 2. Chercher le créneau dans le tableau
        const creneauTrouve = listeCreneaux.find(c => {
            const estLeBonJour = parseInt(c.jour_semaine) === jourChoisi;
            // On vérifie si l'heure choisie est comprise entre heure_debut et heure_fin
            const estDansLaTranche = heureStr >= c.heure_debut && heureStr <= c.heure_fin;
            
            return estLeBonJour && estDansLaTranche;
        });

        if (creneauTrouve) {
        setFormData(prev => ({ ...prev, id_creneau: creneauTrouve.id_creneau })); //prev =  mon object résa 
        console.log("Créneau trouvé automatiquement : ", creneauTrouve.id_creneau);
        setMessage("Le restaurant est bien ouvert à cette horraire  ✅ ")
        } else {
            setFormData(prev => ({ ...prev, id_creneau: '' }));
            
            setMessage("Le restaurant est fermé à l'heure et à la date sélectionnées !");
        }
    }
    
    //fonction recuperer le role du user
    function recupererRole(){
    

        console.log(user?.role);
   
    }


    useEffect(() => {
        // IMPORTANT : On attend que le context ait fini de chercher l'utilisateur.
        // Si user est indéfini ou en cours de chargement dans Context, ajuster cette ligne.
        if (loadingAuth) return;
        if (user === null) {
            // L'utilisateur n'est vraiment pas connecté
            alert("Il faut être connecté pour pouvoir réserver !");
           navigate("/", { replace: true });
        } else if ( user.role !== "client" && user.role !== "admin") {
            // L'utilisateur est connecté mais n'est pas un client (ex: admin, employe...)
            alert("Accès refusé : Seuls les clients peuvent réserver !");
            navigate("/", { replace: true });
        }
    }, [user, loadingAuth]);


    return (
      <>
        { (user?.role ===  "client" || user?.role ===  "admin") &&(
           
            <div className="reservation-form">

                <div className="reservation">
                    <h1>Réservation d'une Table</h1>
                
                <h2>Nouvelle Réservation</h2>
                
                {message && <div className="alert">{message}</div>}
                
                <form onSubmit={handleSubmit}>
                    
                    
                    <div>
                        <label>Date :</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.date_reservation}
                            onChange={(e) => {
                                const nouvelleDate = e.target.value;
                                setFormData(prev => ({ ...prev, date_reservation: nouvelleDate }));
                                // On passe directement 'nouvelleDate' car le state n'est pas encore à jour
                                trouverCreneauAuto(nouvelleDate, formData.heure_reservation);
                            }}
                    
                        required
                    />
                </div>

                <div>
                    <label>Heure :</label>
                    <input
                        type="time"
                        value={formData.heure_reservation}
                       onChange={(e) => {
                            const nouvelleHeure = e.target.value; // récupère l'heure selectionné 
                            setFormData(prev => ({ ...prev, heure_reservation: nouvelleHeure }));
                            // On passe directement 'nouvelleHeure'
                            trouverCreneauAuto(formData.date_reservation, nouvelleHeure);
                        }}
                        required
                    />
                </div>

                <div>
                    <label>Nombre de personnes :</label>
                    <input
                        type="number"
                        value={formData.nb_personnes}
                        onChange={(e) => setFormData({...formData, nb_personnes: e.target.value})}
                        min="1"
                    />
                </div>

                <div>
                    
                </div>

                <button type="submit" >
                    {loading ? 'Réservation en cours...' : 'Réserver'}
                </button>
            </form>
            </div>
        </div>
      )}
        </>
    );
    }


export default ReservationForm;