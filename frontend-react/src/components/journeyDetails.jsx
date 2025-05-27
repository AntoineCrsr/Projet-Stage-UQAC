import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/journeyDetails.css";

import { useTranslation } from "react-i18next";

const JourneyDetails = () => {
    const { t } = useTranslation("journeydetails");

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
        {t("back")}
        </button>
    <div className="journey-content">
        {/* colonne gauche : infos */}
        <div className="journey-infos">
            <h2>{t("title")}</h2>
            <p><strong>{t("publishedBy")}</strong> {ownerPublicName}</p>
            <p><strong>{t("departure")}</strong> {journey.starting.address}</p>
            <p><strong>{t("arrival")}</strong> {journey.arrival.address}</p>
            <p><strong>{t("date")}</strong> {format}</p>
            <p><strong>{t("seats")}</strong> {journey.seats.total - journey.seats.left} / {journey.seats.total}</p>
            <p><strong>{t("price")}</strong> {journey.price} $ CAD</p>
        </div>
        {!isCreator && (
        <button className="btn-conducteur-profile"
        onClick={() => navigate(`/profilconducteur/${journey.ownerId}`)}>
            {t("viewDriver")}
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
        {t("book")}
    </button>
    )}
    </div>
    );
};

export default JourneyDetails;
