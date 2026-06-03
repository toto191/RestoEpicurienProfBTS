import { useState, useEffect, useRef, useContext } from "react";
import "./Login.css"
import { createUser, LoginUser,PasserLogin } from "../../api/user.js";
import { getReservationsByID,deleteReservation } from '../../api/reservation.js';
import { AuthContext } from "../../authContext.jsx";



export default function Login() {

          
    const { user, setUser } = useContext(AuthContext);
      // Par défaut, le formulaire est visible (false) // renvoie un object 
    const [isVisible, setIsVisible] = useState(false) // [] renvoie un tableau
    
    // Au chargement du composant, on vérifie si une session existe
    useEffect(() => {
        const savedUser = localStorage.getItem("userData");
        const token = localStorage.getItem("userToken");
        
        if (savedUser && token) {
          
            // Si elle renvoie FALSE (pas expiré), on entre dans le bloc
        if (!checkTokenExpiration()) {
            setUser(JSON.parse(savedUser));  // On transforme la chaîne JSON en objet JS
            console.log("Session valide, utilisateur connecté.");
        } else {
            // 3. Si c'est expiré, on nettoie tout par sécurité
            console.log("Session expirée, nettoyage...");
            handleLogout(); 
        }
        }
    }, []);

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
    };


    const handleCreateAccount = () => {
       setIsVisible(!isVisible);
    };

     //------------------------------ création count --------------------------------
     // À l'intérieur du composant Login
        const [formData, setFormData] = useState({
            email: "",
            nom: "",
            prenom: "",
            password: "",
           
        });

        const[validateMdp,setValidateMdp] = useState({
            confirmPassword: ""
        })

    
        
        const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== validateMdp.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
 
        try {
           
            const result = await createUser(formData);
            alert("Compte créé !");
            setIsVisible(false); // Repasser à l'écran de connexion
        } catch (error) {
            alert("Erreur lors de la création du compte.");
        }


    };




    //--------------------------fin création count -------------------------------

    //------------------------------ Connection ------------------------------------
    const [dataConnection, setDataConect] = useState({
            email: "",
            password: "",
           
        });

     const handleSubmitConnexion = async(e) => {
        e.preventDefault();
        console.log("Submit !");
        // Logique de connexion

         try {
            const result = await LoginUser(dataConnection);
            if (result.status === "success" && result.token) {
            // 1. On stocke le token (le "badge d'accès")
            localStorage.setItem("userToken", result.token);

            // 2. On stocke les infos de l'utilisateur (pour l'affichage : "Bonjour Paul")
            // On transforme l'objet en chaîne de caractères pour le localStorage
            localStorage.setItem("userData", JSON.stringify(result.user));
            // 3. ON MET À JOUR L'ÉTAT (C'est ça qui déclenche l'affichage direct !)
            setUser(result.user);
            
            if (result.expires_at) {
                localStorage.setItem("tokenExpiration", result.expires_at);
            }

            console.log("Session enregistrée dans le localStorage !");
           
            console.log(localStorage.getItem("userToken"))
            
     
        }
        } catch (error) {
            //pour erreur 401/404 /500
           if (error.response && error.response.data) {
             alert(error.response.data.message);
        }else {
        // Si c'est une erreur réseau ou autre (serveur éteint, etc.)
        alert("Erreur réseau : " + error.message);
        }
        }
    };


    // -------------------------------------Afficher les réservations------------------------------
    

    const [resa, setResa] = useState([]);
    const [loading, setLoading] = useState(true);



     useEffect(() => {

        if (!user?.numero || !user?.role) {
        return;
    }
                const fetchMenus =async () =>{ //récupérer les reservations 
                        try{
                            const data = await getReservationsByID(user?.numero,user?.role);
                            console.log("les données envoyées : "+ user?.numero,user?.role)
                            if(Array.isArray(data)){
                                setResa(data);
                            }
                        
                        }catch(error){
                            console.error("Echec de la récupération des resa", error);
                        }finally {
                        setLoading(false); // On arrête le mode "chargement"
                    }
                    };
        
                fetchMenus(); // On lance l'exécution !
                },[user]); // dès que user est défini (après connexion), on récupère les réservations de cet utilisateur


        const [resaVisible, setResaVisible] = useState(false);
    
        const afficherResa= ()=>{
            setResaVisible(!resaVisible)
  
  
        }

        // -------------------------------- supprimer les résas --------------------------------

            //function async pour autorisé le await et pouvoir attendre la confirmation du serveur avant de supprimer du state 
         const deleteResa = async (idSelect) => {
             

                const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler votre réservation ?");

                if (confirmation) {
                 
                    try {                        
                        await deleteReservation(idSelect);
                        
                        setResa((prevResa) => {
                            const filtered = prevResa.filter(item => item.id_reservation !== idSelect); // affiche les réservation en enlevant la dernière qu'on vien de supprimer
                            return filtered;
                        });

                    } catch (error) {
                        console.error("Erreur détectée:", error);
                        alert(error.message);
                    }
                }
            };
        // -----------------------------------Partie création compte-----------------------------

        

        // Fonction pour mettre à jour l'objet dès qu'on tape au clavier
        const handleChange = (e) => {
            const { name, value } = e.target;
            // Si c'est le champ de confirmation, on met à jour validateMdp
            if (name === "confirmPassword") {
                setValidateMdp({ confirmPassword: value });
            } 
                // 2. On met à jour l'état de création
            setFormData(prev => ({ ...prev, [name]: value }));

            // 3. On met à jour l'état de connexion (Attention au nom : setDataConect)
            setDataConect(prev => ({ ...prev, [name]: value }));
        }; 

        // partie passer update
        const [ouvert, setOuvert] = useState(false); // utiliser useState à la place de let car sinon 'ecran ne va pas changer l'apparence du btn 
        const handleAdmin =() =>{
            setOuvert(!ouvert);
        }



        //------------------passer admin ------------------------
        const actionPasserAdmin = (mdp)=>{
            PasserLogin(mdp);
            handleLogout();
        }
    



    // CAS 1 : L'utilisateur est CONNECTÉ
      //if (loading) return <div id="chargemenntPage"></div>;

    if (user) {
        return (<>
            <div id="espace"></div>
            <div id="login-card" className="profile-view">
                <h2>Mon Profil</h2>
                <h3>Bonjour {user.prenom} </h3>
                <div className="user-info">

                    <p><strong>e-mail : </strong>{user.email}</p>
                    <p><strong>Prénom :</strong> {user.prenom}</p>
                    <p><strong>Nom :</strong> {user.nom}</p>
                    <p><strong>Rôle :</strong> {user.role}</p>
                    
                </div>
                <button type="button" onClick={afficherResa}>{resaVisible ? "Cacher vos réservations" : "Afficher vos réservations"}</button> {/* pas mettre afficherResa sinon boucle infini qui appel cette fonction*/} 
                {resaVisible &&(  
                <div id="liste_resa">
                    <h3>liste de vos reservations : </h3>
                    <ul>
                         
                        {resa.map((uneResa)=>(
                        <li label="'Reservation " key={uneResa.id_reservation || index}> 
                            <ul>
                                <li label= "Date :"> {uneResa.date_reservation}</li>
                                <li label= "Heure :"> {uneResa.heure_reservation}</li>
                                <li label ="Nombre de personnes :">{uneResa.nb_personnes}</li>
                                <li 
                                    label="Status :" 
                                    className={`status-pill ${uneResa.statut_nom?.toLowerCase().replace(/\s+/g, '-')}`} //regex
                                >
                                    {uneResa.statut_nom}
                                </li>
                            </ul>
                        <button type="button" onClick={()=>deleteResa(uneResa.id_reservation)}></button> {/*Envelopper dans ()=> : une fonction anonyme pour pas appeler automatiquement la fonction  */}
                        </li>
                        ))}
                    </ul>
                </div>
                )}


                <button onClick={handleLogout} className="btn-logout">
                    Se déconnecter
                </button>
                 <button onClick={handleAdmin} className="btn-logout">
                    Passer admin 
                </button>
                {ouvert &&(
                    <div className="panneau-admin">
                    <label>Mot de passe admin : </label>
                    <input 
                        name="password" 
                        type="password"
                        value={dataConnection.password} 
                        onChange={handleChange} 
                        required
                        placeholder="••••••••"
                    />
                    
                    <button onClick={() => actionPasserAdmin(dataConnection.password)}>
                        Valider le rang Admin
                    </button>
                    </div>
                    
                )}

            </div>
            </>
        );
    }

    return (
        <>

        <div id="login-card">
            {!isVisible && (
            <div id="parti-log">
                <h2>
                    Connexion
                </h2>
                
                <form onSubmit={handleSubmitConnexion}>
                    <label>e-mail</label>
                    <input 
                        name="email" // Ajouté
                        type="email"
                        value={dataConnection.email} // Ajouté
                        onChange={handleChange} // Ajouté
                        required
                        placeholder="nom@exemple.com"
                    />
                    
                    <label>Mot de passe</label>
                    <input 
                        name="password" // Ajouté
                        type="password"
                        value={dataConnection.password} // Ajouté
                        onChange={handleChange} // Ajouté
                        required
                        placeholder="••••••••"
                    />

                    <button type="submit">Se connecter</button>
                </form>
                
            </div>
                )
            }
            {/* 2. On utilise une fonction fléchée () => dans le onClick pour éviter le crash */}
                    <button 
                        id="btn-switch" 
                        onClick={() => handleCreateAccount()}
                        style={{marginTop: '1rem', background: 'none', color: 'var(--gold)', border: 'none', cursor: 'pointer'}}
                    >
                        Pas de compte ? Créer un compte
                    </button>

            {isVisible && (
            <div id="parti-create">
                <h2>
                    Créer un compte
                </h2>
                 <form onSubmit={handleSubmit}>
                    <label>e-mail</label>
                    <input 
                        
                        placeholder="paul.bocuse@exemple.com"
                        name="email" // <--- IMPORTANT : le 'name' doit correspondre
                        type="email"    
                        value={formData.email}
                        onChange={handleChange} 
                        required
                    />

                    <label>nom</label>
                    <input 
                       type="text" 
                       name="nom"
                       value={formData.nom}
                        onChange={handleChange} 
                        required
                        placeholder="Bocuse"
                    />
                    <label>Prenom</label>
                    <input 
                        name="prenom"
                        type="text" 
                        value={formData.prenom}
                        onChange={handleChange} 
                        required
                        placeholder="Paul"
                    />
                    
                    <label>Mot de passe</label>
                    <input
                        name="password"
                            type="password" 
                            value={formData.password}
                            onChange={handleChange} 
                            required
                        placeholder="••••••••"
                        minLength="8"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Doit contenir au moins un chiffre, une majuscule et 8 caractères."
                    />
                    <label>confirmez mot de passe</label>
                    <input 
                        name="confirmPassword"
                            type="password" 
                            value={validateMdp.confirmPassword}
                            onChange={handleChange} 
                            required
                            placeholder="••••••••"
                            minLength="8"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Doit contenir au moins un chiffre, une majuscule et 8 caractères."
                    />


                    <button type="submit">Création</button>
                </form>
                
            </div>
                )
            }
        </div>
        </>
    );
}