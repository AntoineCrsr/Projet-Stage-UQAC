import { useEffect, useState } from "react";
import "./styles/journeyList.css";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

const JourneyList = () => {
  const { t } = useTranslation("journeylist");

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
      <h2>{t("title")}</h2>
      {journeys.length === 0 ? (
        <p>{t("noJourney")}</p>
      ) : (
        <table className="journey-table">
          <thead>
            <tr>
              <th>{t("departure")}</th>
              <th>{t("arrival")}</th>
              <th>{t("date")}</th>
              <th>{t("seats")}</th>
              <th>{t("price")}</th>
              <th>{t("details")}</th>
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
              const isCreator = journey.ownerId === userId;
              const isReserved = reservedJourneyIds.includes(journey._id);
              const isDone = journey.state === "d"; // priorité à l'état
              const isFull = journey.seats.left === 0;

              const rowClass = isDone
                ? "disabled-row"
                : isCreator
                ? "creator-row"
                : isFull
                ? "disabled-row"
                : "";

              return (
                <tr key={journey._id} className={rowClass}>
                  <td>{journey.starting.city}</td>
                  <td>{journey.arrival.city}</td>
                  <td>{formatDate}</td>
                  <td>{journey.seats.left}</td> 
                  <td>{journey.price} $ CAD</td>
                  <td>
                  {isDone ? (
                      <span className="badge-reserved">{t("ended")}</span>
                    ) : isCreator ? (
                      <Link to={`/journey/${journey._id}`} className="btn-details-liste">
                        {t("creator")}
                      </Link>
                    ) : isReserved ? (
                      <span className="badge-reserved">{t("reserved")}</span>
                    ) : isFull ? (
                      <span className="badge-reserved">{t("full")}</span>
                    ) : (
                      <Link to={`/journey/${journey._id}`} className="btn-details-liste">
                        {t("book")}
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