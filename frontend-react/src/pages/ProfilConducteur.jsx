import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilConducteur = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/auth/${id}`)
        .then(res => res.json())
        .then(data => setDriver(data))
        .catch(err => console.error("Erreur profil conducteur :", err));

        fetch(`http://localhost:3000/api/review?reviewedId=${id}`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.error("Erreur avis conducteur :", err));
    }, [id]);

    if (!driver) return <p>Chargement du profil du conducteur...</p>;

    return (
        <div className="profil-container">
        
        <h2>Profil du conducteur</h2>
        {/*driver.imageUrl && <img src={driver.imageUrl} alt="profil" className="profil-image" />*/}
        <p><strong>Nom :</strong> {driver.name.lastName}</p>
        <p><strong>Prénom :</strong> {driver.name.firstName}</p>

        <h3>Nombre de trajets déjà effectués :</h3>
        <p>Trajets : {driver.statistics.nbRidesCompleted}</p>

        <h3>Moyenne des évaluations</h3>
        <p>Ponctualité : {driver.rating.punctualityRating ?? "Pas encore évalué"}/5</p>
        <p>Sécurité : {driver.rating.securityRating ?? "Pas encore évalué"}/5</p>
        <p>Confort : {driver.rating.comfortRating ?? "Pas encore évalué"}/5</p>
        <p>Courtoisie : {driver.rating.courtesyRating ?? "Pas encore évalué"}/5</p>

        <h3>Avis des passagers</h3>
        <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #ccc", padding: "1rem" }}>
            {reviews.length === 0 ? (
            <p>Aucun avis disponible</p>
            ) : (
            reviews.map((rev, index) => (
                <div key={index} className="review-item">
                <p>{rev.punctualityRating}/5 - {rev.message}</p>
                </div>
            ))
            )}
        </div>
        </div>
    );
};

export default ProfilConducteur;
