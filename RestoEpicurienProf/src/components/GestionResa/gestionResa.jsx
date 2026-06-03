import { getReservationsByID,deleteReservation } from '../../api/reservation.js';
import { useState, useEffect, useRef, useContext, use } from "react";
import { AuthContext } from "../../authContext.jsx";
import { getStatus } from '../../api/status.js';
import {updateReservation} from '../../api/reservation.js';
import {Login} from "../login/Login.jsx";
import { Link,useNavigate } from 'react-router-dom';
import './gestionResa.css';


export default function GestionResa() {
    const { user,verifySession,loadingAuth  } = useContext(AuthContext);
    const [resa, setResa] = useState([]);
    const [originalResa, setOriginalResa] = useState([]); // La sauvegarde (ne change jamais)
    const [isSorted, setIsSorted] = useState(false); // Pour savoir si on croissan ou descroissan 
    const [isSortedDate, setIsSortedDate] = useState(false); // Pour savoir si on trie ou si on annule
    const [message, setMessage] = useState('');
    const idSelectRef = useRef(null); // Ref pour stocker l'ID sélectionné
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  

    useEffect(()=>{
        verifySession(); // déconnect si plus de session avec message pour prévenir
    },[]);


     useEffect(() => {
                if (loadingAuth) return;
                  if (!user) {
                    navigate("/", { replace: true });
                    return;
                }
                if(user?.role !== "admin"){
                navigate("/", { replace: true });
                }
                const fetchMenus =async () =>{
                        try{
                            const data = await getReservationsByID(user?.numero,"admin");
        
                            if(Array.isArray(data)){
                                console.log("les reservations : ", data);
                                setResa(data);
                                setOriginalResa(data);
                            }else{
                                console.error("Les données reçues ne sont pas un tableau", data);
                            }
                        
                        }catch(error){
                            console.error("Echec de la récupération des resa", error);
                        }finally {
                        setLoading(false); // On arrête le mode "chargement"
                    }
                    };
                        
            fetchMenus(); // On lance l'exécution ! 
        },[user,loadingAuth]); // recharge la page si user ou loadingAuth change  

        



     /*---------------------------- gestion des status des réservation -----------------------------*/

        const [statusOptions, setStatusOptions] = useState([]);
        const afficherStatusOptions = async () => {
            try {
                const data = await getStatus();
                setStatusOptions(data);
            } catch (error) {
                console.error("Echec de la récupération des status", error);
            }
        };

        useEffect(() => {
            afficherStatusOptions();            
        }, []); 
        
        
        const deleteResa = async (idSelect) => {
             

                const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler votre réservation ?");

                if (confirmation) {
                 
                    try {                        
                        await deleteReservation(idSelect);
                        
                        setResa((prevResa) => {
                            const filtered = prevResa.filter(item => item.id_reservation !== idSelect);
                            return filtered;
                        });

                    } catch (error) {
                        console.error("Erreur détectée:", error);
                        alert(error.message);
                    }
                }
            };
        


 /*--------------------------------------- submit changement status -------------------------------------- */ 
        const handleStatusChange = async (id_reservation, newStatusId) => {
            try {
                const reservationToUpdate = resa.find(r => r.id_reservation === id_reservation);
                if (!reservationToUpdate) {
                    console.error("Réservation non trouvée pour l'ID :", id_reservation);
                    return;
                }

                reservationToUpdate.id_statut = newStatusId; // Met à jour localement pour l'affichage immédiat
              
                console.log("Données envoyées pour mise à jour :", reservationToUpdate);
                await updateReservation(id_reservation, reservationToUpdate);
                setMessage('✅ Statut mis à jour avec succès'); 
                // Rafraîchir la liste des réservations après la mise à jour
                const data = await getReservationsByID(user?.numero,"admin");
                setResa(data);
            } catch (error) {
                setMessage('❌ Erreur lors de la mise à jour du statut : ' + (error.response?.data?.message || 'Erreur serveur'));
                console.error("Erreur lors de la mise à jour du statut :", error);

            }
        };

        
/*------------------------------------------- filtre tableau -------------------------------------------*/
  
            const filtreDate = () => {
            const tabResaTrie = [...resa].sort((a, b) => {
                const dateA = new Date(a.date_reservation);
                const dateB = new Date(b.date_reservation);

                // On détermine l'ordre selon l'état actuel
                let dateDiff = !isSortedDate ? dateA - dateB : dateB - dateA;

                // Si les dates sont identiques, on trie par heure
                if (dateDiff === 0) {
                    const heureA = a.heure_reservation || "";
                    const heureB = b.heure_reservation || "";
                    return !isSorted 
                        ? heureA.localeCompare(heureB) 
                        : heureB.localeCompare(heureA);
                }

                return dateDiff;
            });

            setResa(tabResaTrie);
            setIsSortedDate(!isSortedDate); // On inverse l'état global du tri
        };


        const filtreConvive = () => {
            // 1. On crée la copie triée
            const tabResaTrie = [...resa].sort((a, b) => {
                if (!isSorted) {
                    // Tri croissant
                    return a.nb_personnes - b.nb_personnes;
                } else {
                    // Tri décroissant
                    return b.nb_personnes - a.nb_personnes;
                }
            });

            // 2. ON APPLIQUE le changement au state (c'est ça qui fait bouger le tableau)
            setResa(tabResaTrie);

            // 3. On inverse le sens pour le prochain clic
            setIsSorted(!isSorted);
        }


    

     return (
        /* REMPLACE LES CLASSES TAILWIND PAR CELLES DU CSS PERSO */
        <>
        {user?.role === "admin" && (
        <div className="resa-container"> 
            <h1 className="resa-title">Gestion des réservations</h1>

          

            {loading && <p className="loading-text">Chargement en cours...</p>}

            {!loading && (
                <div className="table-wrapper">
                    <button onClick={() => setResa(originalResa)}>Annuler filtre</button> {/* () => permet de ne pas déclencher une boucle */}
                    {resa.length > 0 ? (
                        <table className="resa-table">
                            <thead>
                                <tr>
                                    <th>Couverts au nom </th>
                                    <th>Heure</th>
                                    <th><button onClick={filtreDate}>Date ↑↓ </button> {/* ne pas mettre filtreDate() avec () sinon déclenche en boucle la fonction  */}</th>
                                    <th><button onClick={filtreConvive}>Convives ↑↓ </button></th>
                                    <th>Statut</th>
                                    <th>Changement statut</th>
                                    <th>Actions</th>                                    
                                </tr>
                            </thead>
                            <tbody>
                                {resa.map((r) => (
                                    <tr key={r.id_reservation}>
                                        <td>{r.prenom} {r.nom}</td>
                                        <td>{r.heure_reservation || r.heure}</td>
                                        <td>{r.date_reservation || r.date}</td>
                                        <td>{r.nb_personnes} pers.</td>
                                        <td>
                                            <span className={`status-badge ${
                                                r.statut_nom === 'Confirmé' ? 'status-confirme' :
                                                r.statut_nom === 'Annulé' ? 'status-annule' :
                                                r.statut_nom === 'terminé' ? 'status-terminer' :
                                                'status-en-attente'}`}>
                                                {r.statut_nom || "En attente"}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                ref={idSelectRef}
                                                className="status-select"
                                                defaultValue={r.id_statut}
                                                onChange={(e) => handleStatusChange(r.id_reservation,e.target.value)}>
                                            {Array.isArray(statusOptions) && statusOptions.map((option) => (        
                                                <option key={option.id_statut} value={option.id_statut}>
                                                    {option.libelle}
                                                </option>
                                            ))}            
                                            </select>      
                                        </td>
                                        
                                        <td>
                                            <button 
                                                onClick={() => deleteResa(r.id_reservation)}
                                                className="btn-delete"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-text">Aucune réservation trouvée.</p>
                    )}
                </div>
            )}
        </div>
        )}
        </>
    );
}