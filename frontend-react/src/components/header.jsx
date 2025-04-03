import React, { useEffect, useState } from "react";
import "./styles/header.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo_2.png"; 

const Header = () => {

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirige vers la page de connexion
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
      <button className="login-header" onClick={handleLoginClick}> Se connecter</button>
    </header>
  );
};

export default Header;