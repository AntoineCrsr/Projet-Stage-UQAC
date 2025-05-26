import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/journeyForm.css";

import { useTranslation } from "react-i18next";

const JourneyForm = () => {

  const { t } = useTranslation("journeyform");


  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [suggestionsDepart, setSuggestionsDepart] = useState([]);
  const [suggestionsArrivee, setSuggestionsArrivee] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (prefix, setSuggestions) => { //recuperation des villes pour les suggestions dans les champs du form
    if (prefix.length < 2) return setSuggestions([]);
    try {
      const res = await fetch(`http://localhost:3000/api/cities?prefix=${prefix}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Erreur de chargement des villes :", err);
    }
  };

  const handleDepartChange = (e) => {
    const value = e.target.value;
    setDepart(value);
    fetchSuggestions(value, setSuggestionsDepart);
  };

  const handleArriveeChange = (e) => {
    const value = e.target.value;
    setArrivee(value);
    fetchSuggestions(value, setSuggestionsArrivee);
  };

  const handleSwap = () => {
    const tmp = depart;
    setDepart(arrivee);
    setArrivee(tmp);
  };

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
      <h2>{t('title')}</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-container">
          <input
            type="text"
            placeholder={t('departure')}
            value={depart}
            onChange={handleDepartChange}
            required
          />
          {suggestionsDepart.length > 0 && (
            <ul className="suggestions">
              {suggestionsDepart.map((ville, index) => (
                <li key={index} onClick={() => {
                  setDepart(ville);
                  setSuggestionsDepart([]);
                }}>
                  {ville}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="swap-button" onClick={handleSwap} title={t('swap')}>
          ⇄
        </button>

        <div className="input-container">
          <input
            type="text"
            placeholder={t('arrival')}
            value={arrivee}
            onChange={handleArriveeChange}
            required
          />
          {suggestionsArrivee.length > 0 && (
            <ul className="suggestions">
              {suggestionsArrivee.map((ville, index) => (
                <li key={index} onClick={() => {
                  setArrivee(ville);
                  setSuggestionsArrivee([]);
                }}>
                  {ville}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="search-button" type="submit">{t('validate')}</button>
      </form>
    </div>
  );
};

export default JourneyForm;
