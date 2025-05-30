import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profil.css";
import { useTranslation } from 'react-i18next';

const Profil = () => {
    const { t } = useTranslation('profil');

    const [user, setUser] = useState(null);
    const [isStudent, setIsStudent] = useState(false);
    const [aboutMe, setAboutMe] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [myJourneys, setMyJourneys] = useState([]);
    const [myFinishedJourneys, setMyFinishedJourneys] = useState([]);
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();
    const [reservedJourneys, setReservedJourneys] = useState({ enCours: [], termines: [] });
    const [reviews, setReviews] = useState([]);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/review?reviewedId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error("Erreur lors du chargement des avis :", err));
            }
    }, [userId, token]);


    useEffect(() => { //securité si quelqu'un n'est pas connecté mais appelle la route quand meme
    if (!token || !userId) {
        navigate("/login");
        return;
    }

    fetch(`http://localhost:3000/api/auth/${userId}?private=true`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(async(data) => {
        setUser(data);
        setIsStudent(data.isStudent || false);
        setAboutMe(data.aboutMe || "");
        if (data.imageUrl) setImagePreview(data.imageUrl);

        fetch(`http://localhost:3000/api/reservation?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(async (reservations) => {
            const journeys = await Promise.all(
            reservations.map(async (res) => {
                const response = await fetch(`http://localhost:3000/api/journey/${res.journeyId}`);
                if (response.status !== 200 && response.status !== 302) return null;
                const journey = await response.json();
                return {
                ...journey,
                reservationId: res._id, 
                state: journey.state,
                };
            })
            );
            setReservedJourneys({
                enCours: journeys.filter(j => j.state !== "d"),
                termines: journeys.filter(j => j.state === "d")
            });
        })
        .catch(err => console.error("Erreur chargement des réservations :", err));

        fetch(`http://localhost:3000/api/journey`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.json())
        .then((data) => {
            const mine = data.filter(j => j.ownerId === userId);
            const actifs = mine.filter(j => j.state !== "d");
            const termines = mine.filter(j => j.state === "d");
            setMyJourneys(actifs);
            setMyFinishedJourneys(termines);
        })
        .catch(err => console.error("Erreur lors du chargement des trajets :", err));

        fetch(`http://localhost:3000/api/car?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.json())
        .then((carData) => setCars(carData))
        .catch((err) => console.error("Erreur chargement voitures :", err));
    })
    .catch((err) => console.error("Erreur chargement profil :", err));
    }, [userId, token, navigate]);

    const handleDeleteCar = async (carId) => {
    if (!window.confirm("Confirmer la suppression de ce véhicule ?")) return;

    try {
        const res = await fetch(`http://localhost:3000/api/car/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        alert("Véhicule supprimé !");
        setCars((prev) => prev.filter((car) => car._id !== carId));
    } catch {
        alert("Erreur lors de la suppression.");
    }
    };

    const handleEditCar = (carId) => {
    navigate(`/modifier-voiture/${carId}`);
    };

    const handleDeleteJourney = async (id) => {
    if (!window.confirm("Voulez vous vraiment supprimer ce trajet ?")) return;
    try {
        const res = await fetch(`http://localhost:3000/api/journey/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        alert("Trajet supprimé !");
        setMyJourneys((prev) => prev.filter((j) => j._id !== id));
    } catch {
        alert("Erreur lors de la suppression.");
    }
    };

    const handleValidateEmail = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/auth/${userId}/emailValidation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user: { nonce: "000" } }),
            });
            if (!res.ok) throw new Error();
            alert("Email validé !");
            setUser(prev => ({ ...prev, hasVerifiedEmail: true }));
        } catch {
            alert("Erreur lors de la validation de l'email.");
        }
    };
    
    const handleValidatePhone = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/auth/${userId}/phoneValidation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user: { nonce: "000" } }),
            });
            if (!res.ok) throw new Error();
            alert("Téléphone validé !");
            setUser(prev => ({ ...prev, hasVerifiedPhone: true }));
        } catch {
            alert("Erreur lors de la validation du téléphone.");
        }
    };

    const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;

    try {
        const res = await fetch(`http://localhost:3000/api/reservation/${reservationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();
        alert("Réservation annulée !");
        setReservedJourneys(prev => prev.filter(j => j.reservationId !== reservationId));
    } catch {
        alert("Erreur lors de l'annulation.");
        }
    };

    if (!user) return <p>Chargement</p>;

    //Le "?" dans les recuperation des valeurs d'attributs servent à eviter des erreurs de valeurs undefined si on arrive pas à les récuperer
    return (
    <div className="profil-container">
        <h2>{t('title')}</h2>

        <div className="profil-section">
        <label>{t('profilePicture')}</label>
        {imagePreview && (
            <img src={imagePreview} alt="profil" className="profil-image" />
        )}
        </div>

        <div className="profil-section">
        <strong>{t('lastName')} :</strong>{user.name?.lastName}</div> 

        <div className="profil-section">
        <strong>{t('firstName')}:</strong>{user.name?.firstName}</div>
        
        <div className="profil-section">
        <strong>{t('publicName')} :</strong>{user.name?.publicName}</div>
        
        <div className="profil-section">
        <strong>Email :</strong> {user.email}{" "}
        {user.hasVerifiedEmail ? (
            <span title={t('verified')}>✅</span> //Verification manuelle de l'email
        ) : (
            <button onClick={handleValidateEmail}>{t('verify')}</button>)}
        </div>

        <div className="profil-section"> 
        <strong>{t('phone')}</strong> Type {user.phone.type} : {user.phone.prefix}{user.phone.number}{" "}
        {user.hasVerifiedPhone ? (
            <span title={t('verified')}>✅</span> //Verification manuelle du téléphone
        ) : (
            <button onClick={handleValidatePhone}>{t('verify')}</button>)}
        </div>


        <div className="profil-section">
        <strong>{t('gender')} :</strong> {user.gender}</div>
        
        <div className="profil-section">
        <strong>{t('birthDate')} :</strong>{" "}
        {new Date(user.dateBirthday).toLocaleDateString()}</div>
        

        <div className="profil-section">
        <label>
            <input
            type="checkbox"
            checked={isStudent}
            readOnly // empeche l'user de le modifier s'il n'est pas sur la page de modif
            />
            {t('student')}
        </label>
        </div>

        <div className="profil-section">
        <label>{t('about')} :</label>
        <textarea
            value={aboutMe}
            placeholder={t('describe')}
            readOnly // empeche l'user de le modifier s'il n'est pas sur la page de modif
        />
        <button onClick={() => navigate("/modifier-profil")}>{t('editProfile')}</button>
        </div>

        <h3>{t('ratingsTitle')}</h3>
        <div className="profil-info"> {t('punctuality')} : {user.rating?.punctualityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> {t('security')} : {user.rating?.securityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> {t('comfort')} : {user.rating?.comfortRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> {t('courtesy')} : {user.rating?.courtesyRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> {t('votes')} : {user.rating?.nbRating}</div>

        <h3>{t('reviewsTitle')}</h3>
        {reviews.length === 0 ? ( //Conteneur scrollable de tous les avis laissés par les passagers au conducteur
        <p>{t('noReviews')}</p>
        ) : (
        <div className="review-scrollable"> 
            {reviews.map((r, index) => (
            <div key={index} className="review-card">
                <p><strong>{t('punctuality')} :</strong> {r.punctualityRating}/5</p>
                <p><strong>{t('security')} :</strong> {r.securityRating}/5</p>
                <p><strong>{t('comfort')} :</strong> {r.comfortRating}/5</p>
                <p><strong>{t('courtesy')} :</strong> {r.courtesyRating}/5</p>
                {r.message && <p><em>"{r.message}"</em></p>}
            </div>
            ))}
        </div>
        )}

        <h3>{t('stats')}</h3>
        <div className="profil-info"> {t('ridesDone')} : {user.statistics?.nbRidesCompleted}</div>
        <div className="profil-info"> {t('peopleMet')} : {user.statistics?.nbPeopleTravelledWith}</div>

        <div className="profil-buttons">
        <button onClick={() => navigate("/ajout-voiture")}>{t('addCar')}</button>
        <button onClick={() => navigate("/")}>{t('backHome')}</button>
        </div>
        <h3>{t('myCars')}</h3>
        {cars.length === 0 ? (
        <p>{t('noCars')}</p>
        ) : (
        <ul className="car-list">
        {cars.map((car) => (
            <li key={car._id} className="car-item">
            {t('brand')} : {car.manufacturer} | {t('model')} : {car.model} | {t('year')} : ({car.year}) | {t('color')} : {car.color}
            <br />
            Type : {car.carType} | {t('air')} : {car.airConditioner ? t('yes') : t('no')}
            <div className="car-actions">
                <button onClick={() => handleEditCar(car._id)}>{t('edit')}</button>
                <button onClick={() => handleDeleteCar(car._id)}>{t('delete')}</button>
            </div>
            </li>
        ))}
        </ul>
        )}

        <h3>{t('myJourneys')}</h3>
        {myJourneys.length === 0 ? (
        <p>{t('noJourney')}</p>
        ) : (
        <ul className="mes-trajets">
            {myJourneys.map(j => ( //je recupere en dictionnaire tous les trajets créés par mon user et je vais pour chaque id de trajet afficher les infos
            <li key={j._id}> 
                {j.starting.city} {t('towards')} {j.arrival.city} {t('the')} {new Date(j.date).toLocaleDateString()} à {new Date(j.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                {j.seats.left} {t('remaining')} {j.seats.total} <br />
                <div className="car-actions">
                <button onClick={() => navigate(`/modifier-trajet/${j._id}`)}>{t('edit')}</button>
                <button onClick={() => handleDeleteJourney(j._id)}>{t('delete')}</button>
                </div>
            </li>
            ))}
        </ul>
        )}
        <h3>{t('finishedJourneys')}</h3>
        {myFinishedJourneys.length === 0 ? (
        <p>{t('noFinished')}</p>
        ) : (
        <ul className="mes-trajets">
            {myFinishedJourneys.map(j => (
            <li key={j._id}>
                {j.starting.city} {t('towards')} {j.arrival.city} {t('the')}{" "}
                {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                {j.seats.total - j.seats.left} {t('passengers')} 
            </li>
            ))}
        </ul>
        )}
        <h3>{t('reservedJourneys')}</h3>
        {reservedJourneys.length === 0 ? (
        <p>{t('noReservation')}</p>
        ) : (
        <ul className="mes-trajets">
            {reservedJourneys.enCours.map(j => (
            <li key={j._id}>
                {j.starting.city} → {j.arrival.city} <br />
                {t('departure')} : {j.starting.address}<br />
                {t('arrival')} : {j.arrival.address}<br />
                date : {" "}
                {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br />
                <div className="car-actions">
                <button onClick={() => handleCancelReservation(j.reservationId)}>{t('cancelReservation')}</button>
            </div>
            </li>
            ))}
        </ul>
        )}
        <h3>{t('finishedAsPassenger')}</h3>
        {reservedJourneys.termines.length === 0 ? (
        <p>{t('noFinishedPassenger')}</p>
        ) : (
        <ul className="mes-trajets">
            {reservedJourneys.termines.map(j => (
            <li key={j._id}>
                {j.starting.city} → {j.arrival.city}<br />
                {t('departure')} : {j.starting.address}<br />
                {t('arrival')} : {j.arrival.address}<br />
                date : {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br />
                <div className="car-actions">
                <button onClick={() => navigate(`/ajouter-avis/${j.ownerId}`)}>{t('leaveReview')}</button>
                </div>
            </li>
            ))}
        </ul>
        )}
    </div>
    );
};

export default Profil;
