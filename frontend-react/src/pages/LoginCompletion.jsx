import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const LoginCompletion = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");

    const [phonePrefix, setPhonePrefix] = useState("+1");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneType, setPhoneType] = useState("mobile");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !gender || !birthDate) {
        setError("Merci de remplir tous les champs.");
        return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("USER ID:", userId);
    if (!token || !userId) {
      setError("Informations utilisateur manquantes. Veuillez vous reconnecter.");
      return;
    }


    try {
        const res = await fetch(`http://localhost:3000/api/auth/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            user: {
              name: {
                  firstName,
                  lastName,
              },
            gender,
            dateBirthday: new Date(birthDate).toISOString(),
            phone: {
              type: phoneType,
              prefix: phonePrefix,
              number: phoneNumber,
            }
          },
        }),
    });
      console.log(res)
      if (res.status === 400) {
        setError("Champs invalides");
        return;
      }

      if (res.status === 401) {
        setError("Non autorisé. Veuillez vous reconnecter");
        return;
      }

      if (res.status === 409) {
        setError("téléphone déjà utilisé");
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }
      // MAJ nom localstorage
      localStorage.setItem("userName", `${firstName} ${lastName}`);
      navigate("/"); // retour à l'accueil une fois le formulaire complété (pas encore testé)
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi des données");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Complétez votre profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Prénom</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Nom</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Genre</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">-- Choisir --</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="input-group">
            <label>Date de naissance</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>

          <div className="input-group">

            <label>Numéro de téléphone</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
              >
                <option value="+1">+1 (CAN/US)</option>
                <option value="+33">+33 (FR)</option>
              </select>

              <input
                type="tel"
                placeholder="Numéro"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              
              <select
                value={phoneType}
                onChange={(e) => setPhoneType(e.target.value)}
              >
                <option value="mobile">Mobile</option>
                <option value="fixe">Fixe</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <button className="form" type="submit">Valider</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginCompletion;
