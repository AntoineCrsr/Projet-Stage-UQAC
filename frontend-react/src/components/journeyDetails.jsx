import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/journeyDetails.css";

const JourneyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [journey, setJourney] = useState(null);

useEffect(() => {
    fetch(`http://localhost:3000/api/journey/${id}`)
        .then((res) => res.json())
        .then((data) => setJourney(data))
        .catch((err) => console.error("Erreur :", err));
    }, [id]);

    if (!journey) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Recupération des détails du trajet ... </p>;}
    return (
    <div className="journey-container">
      {/* bouton retour */}
        <button className="btn-back" onClick={() => navigate("/")}>
        ← Retour
        </button>
    <div className="journey-content">
        {/* colonne gauche : infos */}
        <div className="journey-infos">
            <h2>Détails du trajet</h2>
            <p><strong>Départ :</strong> {journey.starting.city} - {journey.starting.adress}</p>
            <p><strong>Arrivée :</strong> {journey.arrival.city} - {journey.arrival.adress}</p>
            <p><strong>Date :</strong> {journey.date}</p>
            <p><strong>Places restantes :</strong> {journey.seats.left} / {journey.seats.total}</p>
            <p><strong>Prix :</strong> {journey.price} $ CAD</p>
        </div>

    {/* Map à inserer quand on utilisera l'API de google
        <div id="map-container" style={{ height: "400px", marginTop: "20px" }}>
        </div>
        */}
    </div>
    {/* bouton réserver qui sera relié plus tard*/}
    <button className="btn-reserver">Réserver ce trajet</button>
    </div>
    );
};

export default JourneyDetails;
