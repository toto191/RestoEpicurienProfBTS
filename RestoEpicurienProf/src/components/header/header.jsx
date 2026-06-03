import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import "./header.css";
import { AuthContext } from "../../authContext.jsx";


export default function NavBar() {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">Le Festin &middot; <span>Épicurien</span></div>

        {/* Nav desktop */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Accueil</Link></li>
          <li><Link to="/reservation" className="nav-item">Réserver une table</Link></li>
          <li><Link to="/menu-carte" className="nav-item">Nos menus</Link></li>
          {user?.role === "admin" && (
            <li><Link to="/create-menu" className="nav-item">Créer un menu</Link></li>
          )}
          {user?.role === "admin" && (
            <li><Link to="/gestion-resa" className="nav-item">Gestion des réservations</Link></li>
          )}
          <li><Link to="/Login" className="nav-button">Login</Link></li>
        </ul>
      </nav>

      
      <button
        className={`burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{ position: 'fixed', top: '1.2rem', right: '5%', zIndex: 10000 }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu mobile overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Accueil</Link>
        <Link to="/reservation" className="nav-item" onClick={() => setMenuOpen(false)}>Réserver une table</Link>
        <Link to="/menu-carte" className="nav-item" onClick={() => setMenuOpen(false)}>Nos menus</Link>
        {user?.role === "admin" && (
          <Link to="/create-menu" className="nav-item" onClick={() => setMenuOpen(false)}>Créer un menu</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/gestion-resa" className="nav-item" onClick={() => setMenuOpen(false)}>Gestion des réservations</Link>
        )}
        <Link to="/Login" className="nav-button" onClick={() => setMenuOpen(false)}>Login</Link>
      </div>
    </>
  );
}