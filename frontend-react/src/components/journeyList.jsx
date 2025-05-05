import React, { useEffect, useState } from "react";
import "./styles/journeyList.css";
import { Link } from "react-router-dom";

const JourneyList = () => {
  const [journeys, setJourneys] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:3000/api/journey")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJourneys(data);
        } else {
          console.error("Format inattendu :", data);
        }
      })
      .catch((err) => console.error("Erreur lors du chargement des trajets :", err));
  }, []);

  return (
    <div className="journey-list-wrapper">
      <h2>Liste des trajets disponibles :</h2>
      {journeys.length === 0 ? (
        <p>Aucun trajet disponible.</p>
      ) : (
        <table className="journey-table">
          <thead>
            <tr>
              <th>Départ</th>
              <th>Arrivée</th>
              <th>Date</th>
              <th>Places</th>
              <th>Prix</th>
              <th>details/reservation</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => {
              const formatDate = new Date(journey.date).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }).replace(",", ""); // enlève la virgule
              //attention j'ai une inversion de logique sur le calcul des places libres, à revoir.
              return (
                <tr key={journey._id}>
                  <td>{journey.starting.city}</td>
                  <td>{journey.arrival.city}</td>
                  <td>{formatDate}</td>
                  <td>{journey.seats.total - journey.seats.left}/{journey.seats.total}</td> 
                  <td>{journey.price} $ CAD</td>
                  <td>
                    <Link to={`/journey/${journey._id}`} className="btn-details-liste">
                      details/reserver
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JourneyList;