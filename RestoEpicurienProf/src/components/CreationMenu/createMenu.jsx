import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../authContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import "./createMenu.css";
import { createMenu } from "../../api/Menu.js"; 



export default function CreateMenu() {
     const { user, setUser } = useContext(AuthContext);
     const navigate = useNavigate();

    const [formData, setFormData] = useState({
            nom: "",
            entree: "",
            plat: "",
            dessert: "",
            prix: 0,
            est_a_la_carte: false,
           
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ici tu peux faire un appel API pour envoyer formData au backend

         try {
            console.log("Envoi des données...", formData);
            const result = await createMenu(formData);
            console.log("Menu créer avec succès :", result);
            alert("Menu créé !");
            setFormData({
            nom: "",
            entree: "",
            plat: "",
            dessert: "",
            prix: 0,
            est_a_la_carte: false,
            });
       
         } catch (error) {
            alert("Erreur lors de la création du menu.");
         }

    }

    useEffect(()=>{
      
      if(user?.role !== "admin"){
         navigate("/", { replace: true });

      }
    })




   return (
    <>
    {user?.role === "admin" &&(
    <div className="menu-form-page">
      <div className="menu-form-page__line" />
 
      <div className="menu-form-card">
 
        <div className="menu-form-card__header">
          <div className="menu-form-card__eyebrow">Composition</div>
          <h1 className="menu-form-card__title">Créer un <em>menu</em></h1>
        </div>
 
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
            <input type="text" id="entree" name="entree" value={formData.entree} onChange={(e) => setFormData({...formData, entree: e.target.value})}  placeholder="ex. Velouté de butternut…" required />
          </div>
 
          <div className="menu-form-group">
            <label htmlFor="plat">Plat</label>
            <input type="text" id="plat" name="plat" value={formData.plat} onChange={(e) => setFormData({...formData, plat: e.target.value})} placeholder="ex. Filet de sole meunière…" required />
          </div>
 
          <div className="menu-form-group">
            <label htmlFor="dessert">Dessert</label>
            <input type="text" id="dessert" name="dessert" value={formData.dessert} onChange={(e) => setFormData({...formData, dessert: e.target.value})} placeholder="ex. Soufflé au Grand Marnier…" required />
          </div>
 
          <div className="menu-form-group">
            <label htmlFor="prix">Prix</label>
            <input 
                type="number" 
                name="prix" 
                value={formData.prix} 
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })} 
                />  
            </div>
 
          <div className="menu-form-group menu-form-group--checkbox">
            <label htmlFor="carte">Mettre à la carte</label>
            <div className="menu-form-checkbox-wrap">
            <input 
                 type="checkbox" 
                  name="est_a_la_carte" 
                  checked={Boolean(formData.est_a_la_carte)}
                  onChange={(e) => setFormData({ ...formData, est_a_la_carte: e.target.checked ? 1 : 0})} 
                            />
            </div>
            <span className="menu-form-carte-label">Afficher dans la carte du restaurant</span>
          </div>
 
          <div className="menu-form-ornament">
            <span /><em>✦</em><span />
          </div>
 
          <div className="menu-form-card__footer">
            <button type="reset" className="menu-form-btn-reset">Annuler</button>
            <button type="submit" className="menu-form-btn-submit">Créer le menu</button>
          </div>
 
        </form>
      </div>
    </div>
    )}
    </>
  );

}
