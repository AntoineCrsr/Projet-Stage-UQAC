import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/journeyDetails.css";

const JourneyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [journey, setJourney] = useState(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const [ownerPublicName, setOwnerPublicName] = useState(null);
    
useEffect(() => {
    fetch(`http://localhost:3000/api/journey/${id}`)
        .then((res) => res.json())
        .then((data) => {setJourney(data);
            // On récupère ensuite le publicName du créateur du trajet'
            return fetch(`http://localhost:3000/api/auth/${data.ownerId}`);
        })
        .then((res) => res.json())
        .then((userData) => {
            setOwnerPublicName(userData.name?.publicName || "Utilisateur inconnu");
        })
        .catch((err) => console.error("Erreur :", err));
    }, [id]);

    if (!journey) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Recupération des détails du trajet ... </p>;}

    const isCreator = journey.ownerId === userId;

    const format = new Date(journey.date).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    });

    const handleReservation = async () => {
        if (!token || !userId) {
        alert("Vous devez être connecté pour réserver un trajet.");
        navigate("/login");
        return;
        }

        const confirm = window.confirm("Souhaitez-vous vraiment réserver ce trajet ?");
        if (!confirm) return;

        try {
        const res = await fetch("http://localhost:3000/api/reservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                reservation: {
                    journeyId: id
                }
            }),
        });

        if (!res.ok) throw new Error("Échec de la réservation");

        alert("Réservation réussie !");
        navigate("/");
        } catch (err) {
        console.error(err);
        alert("Une erreur est survenue lors de la réservation.");
        }
    };

    return (
    <div className="journey-container">
      {/* bouton retour */}
        <button className="btn-back" onClick={() => navigate(-1)}>
        ← Retour
        </button>
    <div className="journey-content">
        {/* colonne gauche : infos */}
        <div className="journey-infos">
            <h2>Détails du trajet</h2>
            <p><strong>Annonce publiée par :</strong> {ownerPublicName}</p>
            <p><strong>Départ :</strong> {journey.starting.address}</p>
            <p><strong>Arrivée :</strong> {journey.arrival.address}</p>
            <p><strong>Date :</strong> {format}</p>
            <p><strong>Place(s) déjà occupée(s) :</strong> {journey.seats.total - journey.seats.left} / {journey.seats.total}</p>
            <p><strong>Prix :</strong> {journey.price} $ CAD</p>
        </div>
        {!isCreator && (
        <button className="btn-conducteur-profile"
        onClick={() => navigate(`/profilconducteur/${journey.ownerId}`)}>
            Voir le profil du conducteur
        </button>
        )}


    {/* Map à inserer quand on utilisera l'API de google
        <div id="map-container" style={{ height: "400px", marginTop: "20px" }}>
        </div>
        */}
    </div>
    {/* bouton pour reserver */}
    {!isCreator && (
    <button className="btn-reserver" onClick={handleReservation}>
        Réserver ce trajet
    </button>
    )}
    </div>
    );
};

export default JourneyDetails;
