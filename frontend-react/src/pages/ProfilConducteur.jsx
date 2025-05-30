import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next';

const ProfilConducteur = () => {
    const { t } = useTranslation('profil');
    
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/auth/${id}`)  //récupération des infos du conducteur
        .then(res => res.json())
        .then(data => setDriver(data))
        .catch(err => console.error("Erreur profil conducteur :", err));

        fetch(`http://localhost:3000/api/review?reviewedId=${id}`) //récupération des avis laissés au conducteur
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(err => console.error("Erreur avis conducteur :", err));
    }, [id]);

    if (!driver) return <p>Chargement du profil du conducteur...</p>; // si l'api met du temps à répondre pour pas afficher d'erreurs

    return (
        <div className="profil-container">
        
        <h2>{t('driverProfile')}</h2>
        <img
            src={driver.imageUrl}
            alt="Photo du conducteur"
            className="driver-profile-image"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />

        <p><strong>{t('lastName')}</strong> {driver.name.lastName}</p>
        <p><strong>{t('firstName')}</strong> {driver.name.firstName}</p>

        <h3>{t('ridesDone')}</h3>
        <p>{driver.statistics.nbRidesCompleted}</p>

        <h3>{t('ratingsTitle')}</h3>
        <p>{t('punctuality')} : {driver.rating.punctualityRating ?? t('noValues')}/5</p>
        <p>{t('security')} : {driver.rating.securityRating ?? t('noValues')}/5</p>
        <p>{t('comfort')} : {driver.rating.comfortRating ?? t('noValues')}/5</p>
        <p>{t('courtesy')} : {driver.rating.courtesyRating ?? t('noValues')}/5</p>

        <h3>{t('reviewsTitle')}</h3>
        <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #ccc", padding: "1rem" }}>
            {reviews.length === 0 ? (
            <p>{t('noReviews')}</p>
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
