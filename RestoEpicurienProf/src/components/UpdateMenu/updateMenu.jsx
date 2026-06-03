import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../../authContext.jsx";
import { updateMenu, deleteMenu } from "../../api/Menu.js";
import "./updateMenu.css";




export default function UpdateMenu() {

    
    const location = useLocation();
    const menu = location.state?.menuData; // On récupère l'objet passé
    const navigate = useNavigate();
    const { user,setUser,verifySession,loadingAuth} = useContext(AuthContext); // Accès direct !

    useEffect(()=>{
        verifySession(); // pour verifier si on est tjr en session si on ne l'ai pas on envois un un message d'erreur 
    },[]);
    

        useEffect(() => {
        if (menu) {
            console.log("Données reçues pour mise à jour (une seule fois) :", menu);
        }
    }, []); // Le tableau vide [] permet de ne pas recharer la page à chaque fois qu'un élément changes 

        const [formData, setFormData] = useState({
        nom: menu?.nom || "",
        entree: menu?.entree || "",
        plat: menu?.plat || "",
        dessert: menu?.dessert || "",
        prix: menu?.prix || 0,
        est_a_la_carte: menu?.est_a_la_carte || 0,
        id: menu?.id || null,
    }); 


        
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Ici on peut faire un appel API pour envoyer formData au backend
    
             try {
                console.log("Envoi des données...", formData);
                const result = await updateMenu(menu.id,formData);
                console.log("Menu mis à jour avec succès :", result);
                alert("Menu mis a jour !");
                navigate("/menu-carte");
                setFormData({
                nom: "",
                entree: "",
                plat: "",
                dessert: "",
                prix: 0,
                est_a_la_carte: false,
                });
           
             } catch (error) {
                alert("Erreur lors de la mise à jour du menu !");
             }
    
        }

        const handleDelete = async (e) => {
                e.preventDefault();

                // 1. Demander confirmation à l'utilisateur
                if (!window.confirm(`Voulez-vous vraiment supprimer le menu "${formData.nom}" ?`)) {
                    return; // On arrête tout si l'utilisateur annule
                }

                try {
                    console.log("Suppression du menu ID:", menu.id);
                    
                    // 2. Appel à ton API (assure-toi de passer l'ID)
                    console.log("id envoyé : ",menu.id)
                    await deleteMenu(menu.id); 

                    alert("Le menu a été supprimé avec succès.");

                    // 3. Rediriger l'utilisateur vers la liste des menus
                    navigate("/menu-carte"); 

                } catch (error) {
                    console.error(error);
                    alert("Le menu n'a pas put être supprimé.");
                }
            };


    useEffect(()=>{
        if (loadingAuth) return;
        if(user?.role !== "admin"){
            navigate("/menu-carte", { replace: true });

        }
    })
      
    
    return (
        <>
        {user?.role === "admin" &&(
        <div id="carteMenu">
    
            <div id="desc">
            <h1>Le menu</h1>
            <p>Nom : {menu?.nom}</p>
            <p>Entrée : {menu?.entree}</p>
            <p>Plat : {menu?.plat}</p>
            <p>Dessert : {menu?.dessert}</p>
            <p>Prix : {menu?.prix}€</p>
            <p>À la carte : {menu?.est_a_la_carte ? "Oui" : "Non"}</p>
            </div>
            <div id="formulaire">
                <h2>Modifier le menu</h2>
                <form onSubmit={handleSubmit}>
                   
                     <div className="menu-form-group">
                        <label htmlFor="nom">Nom du plat</label>
                        <input 
                            type="text" 
                            name="nom" 
                            value={formData.nom} 
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
                            />
                    </div>
            
                    <div className="menu-form-group">
                        <label htmlFor="entree">Entrée</label>
                        <input type="text" id="entree" name="entree" value={formData.entree} onChange={(e) => setFormData({...formData, entree: e.target.value})}  placeholder="ex. Velouté de butternut…"  />
                    </div>
            
                    <div className="menu-form-group">
                        <label htmlFor="plat">Plat</label>
                        <input type="text" id="plat" name="plat" value={formData.plat} onChange={(e) => setFormData({...formData, plat: e.target.value})} placeholder="ex. Filet de sole meunière…"  />
                    </div>
            
                    <div className="menu-form-group">
                        <label htmlFor="dessert">Dessert</label>
                        <input type="text" id="dessert" name="dessert" value={formData.dessert} onChange={(e) => setFormData({...formData, dessert: e.target.value})} placeholder="ex. Soufflé au Grand Marnier…"  />
                    </div>
            
                    <div className="menu-form-group">
                        <label htmlFor="prix">Prix</label>
                        <input 
                            type="number" 
                            name="prix" 
                            value={formData.prix} 
                            onChange={(e) => setFormData({ ...formData, prix: e.target.value })} //e.target.value met la valeur pruix a jour 
                            />  
                        </div>
            
                    <div className="menu-form-group menu-form-group--checkbox">
                        <label htmlFor="carte">Mettre à la carte</label>
                        <div className="menu-form-checkbox-wrap">
                        <input 
                            type="checkbox" 
                            name="est_a_la_carte" 
                            checked={Boolean(formData.est_a_la_carte)}
                            onChange={(e) => setFormData({ ...formData, est_a_la_carte: e.target.checked ? 1 : 0})} //e.target.value met la valeur 1 ou 0 à jour pour mettre a la carte ou non 
                            />
                        </div>
                        <span className="menu-form-carte-label">Afficher dans la carte du restaurant</span>
                    </div>
                    <div className="menu-form-card__footer">
                        <button type="submit" className="menu-form-btn-reset">Modifier le menu</button>
                       
                    </div>
                </form>
             
            </div>
                <button type="button" onClick={handleDelete} className="menu-form-btn-submit">Supprimer</button>
        </div>
        )}

        </>

    )
}