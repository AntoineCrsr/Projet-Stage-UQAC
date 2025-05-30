import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/login.css";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation("login");

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
      setError("Format d'email invalide ou mots de passe différents");
      return;
    }

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
      localStorage.setItem("userId", data._id);

      // infos utilisateur
      const userRes = await fetch(`http://localhost:3000/api/auth/${data._id}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();
      localStorage.setItem("userName", `${userData.name.firstName} ${userData.name.lastName}`);
      window.dispatchEvent(new Event("storage"));

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
      localStorage.setItem("userId", data._id);

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
        <button onClick={() => navigate("/")} className="btn-retour-accueil">
        {t("return")}
        </button>
        <h2>{isLogin ? t("login") : t("register")}</h2>
        <form onSubmit={handleSubmit}>
        {/* Formulaire de Connexion */}
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder={t("emailPlaceholder")}
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

            <div className="input-group">
              <label>{t("password")}</label>
              <input type="password" placeholder={t("passwordPlaceholder")}
              value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            {!isLogin && (
            <div className="input-group">
              <label>{t("confirmPassword")}</label>
              <input
                type="password" placeholder={t("confirmPasswordPlaceholder")}
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          )}

            <button className="form" type="submit"> {isLogin ? t("submitLogin") : t("submitRegister")} </button>
          </form>
        {error && <p className="error">{error}</p>}

        {/* basculer entre le formulaire de Connexion et d'Inscription */}
        <p className="toggle-text">
          {isLogin ? t("notRegistered") : t("alreadyHaveAccount") }{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? t("createAccount") : t("loginAccount")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
