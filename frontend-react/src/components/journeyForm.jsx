import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/journeyForm.css";

const JourneyForm = () => {
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!depart || !arrivee) {
      alert("Veuillez renseigner les deux villes.");
      return;
    }
    navigate(`/recherche?starting=${encodeURIComponent(depart)}&arrival=${encodeURIComponent(arrivee)}`);
  };

  return (
    <div className="search-container">
      <h2>Cherchez votre trajet dans tout le Québec !</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Ville de départ"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          required
        />
        <span className="arrow">➤</span>
        <input
          type="text"
          placeholder="Ville d'arrivée"
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
          required
        />
        <button className="search-button" type="submit">Valider</button>
      </form>
    </div>
  );
};

export default JourneyForm;
