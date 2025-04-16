import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const LoginCompletion = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !gender || !birthDate) {
        setError("Merci de remplir tous les champs.");
        return;
    }

    /*const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");*/

    /*try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`, {
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
            dateBirthday: new Date(birthDate).getTime(),
            },
        }),
    });

      if (!res.ok) throw new Error("Erreur API");

      // MAJ nom localstorage
      localStorage.setItem("userName", `${firstName} ${lastName}`);
      navigate("/"); // retour à l'accueil une fois le formulaire complété (pas encore testé)
    } catch (err) {
      console.error(err);
      setError("Impossible de compléter le profil. Réessayez.");
    }*/
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

          <button className="form" type="submit">Valider</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginCompletion;
