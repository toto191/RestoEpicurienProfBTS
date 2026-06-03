import React from 'react';
import { useState, useEffect, useRef,useContext } from "react";
import { getMenu } from "../../api/Menu.js"; 
import "./menu-carte.css"
import { Link ,useNavigate} from 'react-router-dom';
import { AuthContext } from "../../authContext.jsx";



export default function MenuCarte() {


   const unMenu = (data = {}) => ({
    id: data.id || 0,
    nom: data.nom || "",
    entree: data.entree || "",
    plat: data.plat || "",
    dessert: data.dessert || "",
    prix: data.prix || 0,
    est_a_la_carte: data.est_a_la_carte || 0,
});

// Dans ton composant :
const [menus, setMenus] = useState([unMenu()]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const { user } = useContext(AuthContext);
    
useEffect(() => {
        const fetchMenus =async () =>{
                try{
                     let  ttAfficher = 1
                    if(user?.role === "admin" ){  // ? permet que le test fonctionne meme si user est nulle
                          ttAfficher = 0;
                    }
                    console.log("valeur filtre menu affichées : " + ttAfficher)
                    const data = await getMenu(ttAfficher);

                    if(Array.isArray(data)){
                        console.log("les menus : ", data);
                        setMenus(data);
                    }else{
                        console.error("Les données reçues ne sont pas un tableau", data);
                    }
                
                }catch(error){
                    console.error("Echec de la récupération des menus", error);
                }finally {
                setLoading(false); // On arrête le mode "chargement"
            }
            };

        fetchMenus(); // On lance l'exécution !

        }, []);
    
    
    if (loading) return <div id="chargemenntPage"></div>;

    return (
        <>
        {user?.role === "admin" && (
            <>
        <div id="espace"></div>
       <div className="container">
        <h1>Nos Menus</h1>
        
        <ul >
            {menus.map((menu) => ( // on donne comme nom menu a chaque partie disocié grace à map
              
               <Link to="/update-menu" 
                    state={{ menuData: menu }} 
                    key={menu.id} 
                    className="nav-item"> 
                <li >
                     <div className="card-Menu">
                        <h3>{menu.nom}</h3>
                        <ul>
                        <li>{menu.entree}</li>
                        
                            <li>{menu.plat}</li>
                            
                            <li>{menu.dessert}</li>
                        </ul>
                       <p><strong>Prix :</strong> {menu.prix}€</p>
                       </div>
                </li>
                </Link>
            ))}
        </ul>
            
        </div>
        </>
        )}
         {user?.role !== "admin" && (
            <>
        <div id="espace"></div>
       <div className="container">
        <h1>Nos Menus</h1>
        
        <ul >
            {menus.map((menu) => ( // on donne comme nom menu a chaque partie disocié grace à map
               
                <li >
                    <div className="card-Menu">
                    <h3>{menu.nom}</h3>
                    <ul>
                       <li>{menu.entree}</li>
                       
                        <li>{menu.plat}</li>
                        
                        <li>{menu.dessert}</li>
                    </ul>
                       <p><strong>Prix :</strong> {menu.prix}€</p>
                     </div> 
                </li>
               
                
            ))}
        </ul>
            
        </div>
        </>
        )}
        
        </>
    )
}