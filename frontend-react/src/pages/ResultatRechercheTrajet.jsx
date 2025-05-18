import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../components/styles/journeyList.css";

const ResultatRechercheTrajet = () => {
    const [results, setResults] = useState([]);
    const [reservedJourneyIds, setReservedJourneyIds] = useState([]); //recuperer les trajets reservés par l'user pour les mêmes logiques que le composant principal
    const location = useLocation(); // Permet de récupérer l'objet contenant la localisation actuelle y compris la query string (?starting=...&arrival=...)

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    //J'utilise URLSearchParams pour parser facilement les paramètres d'URL
    const params = new URLSearchParams(location.search); // plus simple pour recuperer les starting et arrival directement dans l'URL
    const starting = params.get("starting");
    const arrival = params.get("arrival");

    useEffect(() => {
        if (starting && arrival) {
        fetch(`http://localhost:3000/api/journey?starting=${starting}&arrival=${arrival}`)
            .then(res => res.json())
            .then(data => setResults(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur lors de la recherche :", err));
        }
    }, [starting, arrival]);

    useEffect(() => {
        if (token && userId) {
        fetch(`http://localhost:3000/api/reservation?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
            const ids = data.map(res => res.journeyId);
            setReservedJourneyIds(ids);
            })
            .catch(err => console.error("Erreur réservations :", err));
        }
    }, [token, userId]);


    // à la base je voulais faire une update sur le composant principal pour afficher seulement les trajets recherchés, je n'ai pas réussi,
    //puis j'ai essayé de récuperer les trajets sur une autre page et j'ai décidé de garder le même style que sur le composant principal et ça fonctionne.
    // et j'ai aussi réutilisé les même className etc pour réutiliser le même CSS que le composant principal de trajets
    return (
        <div className="journey-list-wrapper">
        <h2>Résultats pour {starting} → {arrival}</h2>
        {results.length === 0 ? (
            <p>Aucun trajet trouvé.</p>
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
                {results.map(journey => {
                const formatDate = new Date(journey.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }).replace(",", "");

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

export default ResultatRechercheTrajet;
