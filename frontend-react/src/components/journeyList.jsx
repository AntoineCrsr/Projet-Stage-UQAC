import React, { useEffect, useState } from "react";
import "./styles/journeyList.css";
import { Link } from "react-router-dom";

const JourneyList = () => {
  const [journeys, setJourneys] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [reservedJourneyIds, setReservedJourneyIds] = useState([]);
  
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

  //recuperer les reservations faites par l'user connecter pour lui indiquer dans le composant
  useEffect(() => {
    if (token && userId) {
      fetch(`http://localhost:3000/api/reservation?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const ids = data.map((res) => res.journeyId);
          setReservedJourneyIds(ids);
        })
        .catch((err) => console.error("Erreur réservations :", err));
    }
  }, [token, userId]);

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
              const isPast = new Date(journey.date) < new Date();
              const isFull = journey.seats.left === 0;
              const isCreator = journey.ownerId === userId;
              const isReserved = reservedJourneyIds.includes(journey._id);

              const disabled = isPast || isFull;
              const rowClass = disabled ? "disabled-row" : isCreator ? "creator-row" : "";
              
              return (
                <tr key={journey._id} className={rowClass}>
                  <td>{journey.starting.city}</td>
                  <td>{journey.arrival.city}</td>
                  <td>{formatDate}</td>
                  <td>{journey.seats.total - journey.seats.left}/{journey.seats.total}</td> 
                  <td>{journey.price} $ CAD</td>
                  <td>
                    {isCreator ? (
                    <Link to={`/journey/${journey._id}`} className="btn-details-liste">
                        Détails de votre trajet
                      </Link>
                    ) : isReserved ? (
                      <span className="badge-reserved">Déjà réservé</span>
                    ) : isFull ? (
                      <span className="badge-reserved">Trajet complet</span>
                    ) : isPast ? (
                      <span className="badge-reserved">Trajet déjà terminé</span>
                    ) : disabled ? (
                      <span className="btn-disabled">Indisponible</span>
                    ) : (
                      <Link to={`/journey/${journey._id}`} className="btn-details-liste">
                        détails/réserver
                      </Link>
                    )}
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