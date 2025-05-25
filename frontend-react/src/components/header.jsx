import React, { useEffect, useState } from "react";
import "./styles/header.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo_2.png"; 

const Header = () => {
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => { //changement de la logique pour recuperer l'image de profil de l'user
    const handleStorageChange = () => { //à voir si on va pas plutot mettre l'image dans le localStorage pour qu'elle soit mise à jour en direct si l'user la change
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userId");
      if (token && id) {
        setIsLoggedIn(true);
        fetch(`http://localhost:3000/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => setUser(data))
          .catch(err => console.error("Erreur chargement user de l'user pour recuperer son image de profil :", err));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    handleStorageChange(); //permet de mettre à jour le header lorsque l'user se connecte/déconnecte
    window.addEventListener("storage", handleStorageChange); //ce qui permet d'afficher son public name
    return () => {                                            //photo de profil et accès à sa page de profil
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload(); //recharge le header  si l'user se déconnecte
  };

  const handleProfile = () => {
    navigate("/profil");
  };

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Logo Travel Express" className="logo-header" />
      </Link>
      <h1 className="title">Travel Express</h1>
      <button className="theme" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      {isLoggedIn ? (
        <>
          <span className="user-name">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="profil"
                className="header-profile-pic"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
            ) : (
              "👤 "
            )}
            {user?.name?.publicName || "Profil"}
          </span>
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