import React, { useEffect, useState } from "react";
import "./styles/journeyList.css"
const JourneyList = () => {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/journey") 
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJourneys(data); // data est un tableau
        } else {
          console.error("Format inattendu :", data);
        }
      })
      .catch((err) => console.error("Erreur lors du chargement des trajets :", err));
  }, []);

  return (
    <div className="journeyList">
      <h2>Liste des trajets disponibles :</h2>
      {journeys.length === 0 ? (
        <p>Aucun trajet disponible.</p>
      ) : (
        <ul>
          {journeys.map((journey) => (
            <li key={journey._id}>
              🚗 {journey.starting.city} → {journey.arrival.city} | 📅 {journey.date} | 💺 {journey.seats.left}/{journey.seats.total} | 💰 {journey.price}$
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JourneyList;