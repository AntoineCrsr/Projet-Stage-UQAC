import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/login.css";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Connexion ou inscription
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState(""); // confirmation du mot de passe
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // URL précédente ou fallback vers /
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && password !== confirm)) {
      setError("Veuillez remplir tous les champs correctement.");
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = { user: { email, password } };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur dans la requête");

      const data = await res.json();

      // Stockage du token et de l'ID
      localStorage.setItem("token", data.token); //il faut quand meme faire attention au localStorage pour les attaques XSS
      localStorage.setItem("userId", data.id);  //mais bon c'est plus pratique pour l'instant et il n'y a pas vraiment de risque actuellement

      // Récupérer les infos du user (nom, prénom...)
      const userRes = await fetch(`http://localhost:3000/api/user/${data.id}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();

      // Stocker le nom complet
      localStorage.setItem("userName", `${userData.firstname} ${userData.lastname}`);

      // Redirection vers la page précédente
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Vérifiez vos informations.");
    }
  };


    return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Connexion" : "Inscription"}</h2>

        {/* Formulaire de Connexion */}
        {isLogin ? (
          <form>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Entrez votre email" />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="Entrez votre mot de passe" />
            </div>

            <button className="form" type="submit">Se connecter</button>
          </form>
        ) : (
          // Formulaire d'Inscription
          <form>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Entrez votre email" />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="Entrez votre mot de passe" />
            </div>

            <div className="input-group">
              <label>Confirmez le mot de passe</label>
              <input type="password" placeholder="Confirmez votre mot de passe" />
            </div>

            <button className="form" type="submit">S'inscrire</button>
          </form>
        )}

        {/* basculer entre le formulaire de Connexion et d'Inscription */}
        <p className="toggle-text">
          {isLogin ? "Pas encore inscrit ?" : "Déjà un compte ?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Créez un compte" : "Connectez-vous"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
