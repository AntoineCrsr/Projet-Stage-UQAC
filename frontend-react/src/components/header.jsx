import React, { useEffect, useState } from "react";
import "./styles/header.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo_2.png"; 

const Header = () => {

  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

useEffect(() => {
  const handleStorageChange = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    } else {
      setIsLoggedIn(false);
      setUserName("Erreur chargement prenom");
    }
  };

  handleStorageChange(); 

  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  
  
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirige vers la page de connexion
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload(); // recharge pour mettre à jour l'affichage du header
  };

    const handleProfile = () => {
    navigate("/profil");
  };

  return (
    <header className="header">
      <Link to="/"> {/*Logo temporaire le temps de l'adapter au header, compte comme bouton retour-accueil*/}
        <img src={logo} alt="Logo Travel Express" className="logo-header" />
      </Link>
      <h1 className="title">Travel Express</h1>
      <button className="theme" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
        {isLoggedIn ? (
        <>
          <span className="user-name">👤 {userName}</span>
          <button className="profil-button" onClick={handleProfile}>
            Profil
          </button>
          <button className="login-header" onClick={handleLogout}>
            Se déconnecter
          </button>
        </>
      ) : (
        <button className="login-header" onClick={handleLoginClick}>
          Se connecter
        </button>
      )}
    </header>
  );
};

export default Header;