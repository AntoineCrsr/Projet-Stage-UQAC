/* const Header = () => {
  return (
    <header className="w-full bg-blue-600 text-white py-4 text-center text-2xl font-bold">
      Travel Express
    </header>
  );
};

export default Header; */

import React from "react";
import "./styles/header.css";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirige vers la page de connexion
  };

  return (
    <header className="header">
      <h1 className="title">Travel Express</h1>
      <button className="login-header" onClick={handleLoginClick}> Se connecter</button>
    </header>
  );
};

export default Header;