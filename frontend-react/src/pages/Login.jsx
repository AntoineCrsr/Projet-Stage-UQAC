import React, { useState } from "react";
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
      setError("Format d'email invalide ou mot de passe différents");
      return;
    }
//sauvegarde au cas où si changement de la réponse de l'api, sinon version actuelle plus bas
  //   const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"; //Si l'user veut se login, appelle la route login, sinon signup
  //   const payload = { user: { email, password } }; //charge les données dans la requete API

  //   // Ne fonctionne pas car l'api ne renvoie pas de code ni de message, ce qui a pour conséquence que je n'ai rien à parser sur le front pour confirmer que ma creation passe bien
  //   // donc message d'erreur et la creation ne passe pas meme si l'email et le mdp sont pris en compte.
  //   try { //on attend la réponse de l'API
  //     const res = await fetch(`http://localhost:3000${endpoint}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       if (res.status === 409) {
  //         throw new Error("Cet email est déjà utilisé.");
  //       }
  //       throw new Error("Erreur dans la requête");}

  //     const data = await res.json();

  //     // Stockage du token et de l'ID
  //     localStorage.setItem("token", data.token); //il faut quand meme faire attention au localStorage pour les attaques XSS
  //     localStorage.setItem("userId", data.id);  //mais bon c'est plus pratique pour l'instant et il n'y a pas vraiment de risque actuellement

  //     if (isLogin){
  //     // Récupérer les infos du user (nom, prénom...)
  //     const userRes = await fetch(`http://localhost:3000/api/user/${data.id}`, {
  //       headers: { Authorization: `Bearer ${data.token}` },
  //     });
  //     const userData = await userRes.json();

  //     // Stocker le nom complet
  //     localStorage.setItem("userName", `${userData.firstname} ${userData.lastname}`);

  //     // Redirection vers la page précédente
  //     navigate(from, { replace: true });
  //     } else { //si pas login alors c'est qu'on créé un compte donc on part sur la suite du formulaire
  //       navigate("/login/completion", { replace: true });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.message);
  //   }
  // };
  try { //changement apres avoir conclu qu'il fallait login apres le signup pour avoir un retour
    if (isLogin) {
      // Connexion simple
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!res.ok) throw new Error("Échec de la connexion");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      // infos utilisateur
      const userRes = await fetch(`http://localhost:3000/api/user/${data.id}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();
      localStorage.setItem("userName", `${userData.firstname} ${userData.lastname}`);

      navigate(from, { replace: true });
    } else {
      // Inscription avec signup
      const signupRes = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (signupRes.status === 409) throw new Error("Cet email est déjà utilisé.");
      if (!signupRes.ok) throw new Error("Échec de l'inscription");

      // Puis login automatique
      const loginRes = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!loginRes.ok) throw new Error("Échec de la connexion après inscription");

      const data = await loginRes.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      //si pas login alors c'est qu'on créé un compte donc on part sur la suite du formulaire
      navigate("/login/completion", { replace: true });
    }
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};


    return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
        <form onSubmit={handleSubmit}>
        {/* Formulaire de Connexion */}
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Entrez votre email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="Entrez votre mot de passe" 
              value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            {!isLogin && (
            <div className="input-group">
              <label>Confirmez le mot de passe</label>
              <input
                type="password" placeholder="Confirmez votre mot de passe"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          )}

            <button className="form" type="submit"> {isLogin ? "Se connecter" : "S'inscrire"} </button>
          </form>
        {error && <p className="error">{error}</p>}

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
