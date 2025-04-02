import React, { useState } from "react";
import "./styles/login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Gère l'affichage connexion/inscription

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
