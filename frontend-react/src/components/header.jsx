import React, { useEffect, useState } from "react";
import "./styles/header.css";
import { useNavigate } from "react-router-dom";


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
      <h1 className="title">Travel Express</h1>
      <button className="theme" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Mode Sombre" : "☀️ Mode Clair"}
      </button>
      <button className="login-header" onClick={handleLoginClick}> Se connecter</button>
    </header>
  );
};

export default Header;