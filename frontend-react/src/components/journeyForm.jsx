import React, { useState } from "react";
import villesQuebec from "../data/villesQuebec"; // villes dans un fichier JSON pour tester en attendant l'API
import "./styles/journeyForm.css"; // Style du composant

const JourneyForm = () => {
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [suggestionsDepart, setSuggestionsDepart] = useState([]);
  const [suggestionsArrivee, setSuggestionsArrivee] = useState([]);

  // Fonction pour filtrer les suggestions
  const handleChange = (value, setValue, setSuggestions) => {
    setValue(value);
    if (value.length > 1) {
      setSuggestions(
        villesQuebec.filter((ville) =>
          ville.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      <h2>Cherchez votre trajet dans tous le Quebec !</h2>
      <div className="search-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Ville de départ"
            value={depart}
            onChange={(e) =>
              handleChange(e.target.value, setDepart, setSuggestionsDepart)
            }
          />
          {suggestionsDepart.length > 0 && (
            <ul className="suggestions">
              {suggestionsDepart.map((ville, index) => (
                <li key={index} onClick={() => setDepart(ville)}>
                  {ville}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="arrow">➤</span>

        <div className="input-container">
          <input
            type="text"
            placeholder="Ville d'arrivée"
            value={arrivee}
            onChange={(e) =>
              handleChange(e.target.value, setArrivee, setSuggestionsArrivee)
            }
          />
          {suggestionsArrivee.length > 0 && (
            <ul className="suggestions">
              {suggestionsArrivee.map((ville, index) => (
                <li key={index} onClick={() => setArrivee(ville)}>
                  {ville}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="search-button">Valider</button>
      </div>
    </div>
  );
};

export default JourneyForm;