import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profil.css";

const Profil = () => {
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
        <h2>Mon Profil</h2>

        <div className="profil-section">
        <label>Photo de profil :</label>
        {imagePreview && (
            <img src={imagePreview} alt="profil" className="profil-image" />
        )}
        </div>

        <div className="profil-section">
        <strong>Nom :</strong>{user.name?.lastName}</div> 

        <div className="profil-section">
        <strong>Prenom :</strong>{user.name?.firstName}</div>
        
        <div className="profil-section">
        <strong>Nom public :</strong>{user.name?.publicName}</div>
        
        <div className="profil-section">
        <strong>Email :</strong> {user.email}{" "}
        {user.hasVerifiedEmail ? (
            <span title="Email vérifié">✅</span>
        ) : (
            <button onClick={handleValidateEmail}>Vérifier</button>)}
        </div>

        <div className="profil-section">
        <strong>Téléphone :</strong> Type {user.phone.type} : {user.phone.prefix}{user.phone.number}{" "}
        {user.hasVerifiedPhone ? (
            <span title="Téléphone vérifié">✅</span>
        ) : (
            <button onClick={handleValidatePhone}>Vérifier</button>)}
        </div>


        <div className="profil-section">
        <strong>Genre :</strong> {user.gender}</div>
        
        <div className="profil-section">
        <strong>Date de naissance :</strong>{" "}
        {new Date(user.dateBirthday).toLocaleDateString()}</div>
        

        <div className="profil-section">
        <label>
            <input
            type="checkbox"
            checked={isStudent}
            readOnly // empeche l'user de le modifier s'il n'est pas sur la page dédiée
            />
            Je suis étudiant(e)
        </label>
        </div>

        <div className="profil-section">
        <label>À propos de moi :</label>
        <textarea
            value={aboutMe}
            placeholder="Décrivez-vous en quelques mots"
            readOnly // empeche l'user de le modifier s'il n'est pas sur la page dédiée
        />
        <button onClick={() => navigate("/modifier-profil")}>Modifier mon profil</button>
        </div>

        <h3>Moyenne des évaluations</h3>
        <div className="profil-info"> Ponctualité : {user.rating?.punctualityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Sécurité : {user.rating?.securityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Confort : {user.rating?.comfortRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Courtoisie : {user.rating?.courtesyRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Nombre de votes : {user.rating?.nbRating}</div>

        <h3>Avis reçus</h3>
        {reviews.length === 0 ? (
        <p>Aucun avis reçu de la part de ses précédents passagers</p>
        ) : (
        <div className="review-scrollable">
            {reviews.map((r, index) => (
            <div key={index} className="review-card">
                <p><strong>Ponctualité :</strong> {r.punctualityRating}/5</p>
                <p><strong>Sécurité :</strong> {r.securityRating}/5</p>
                <p><strong>Confort :</strong> {r.comfortRating}/5</p>
                <p><strong>Courtoisie :</strong> {r.courtesyRating}/5</p>
                {r.message && <p><em>"{r.message}"</em></p>}
            </div>
            ))}
        </div>
        )}

        <h3>Statistiques</h3>
        <div className="profil-info"> Trajets complétés : {user.statistics?.nbRidesCompleted}</div>
        <div className="profil-info"> Personnes rencontrées : {user.statistics?.nbPeopleTravelledWith}</div>

        <div className="profil-buttons">
        <button onClick={() => navigate("/ajout-voiture")}>Ajouter un véhicule</button>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
        </div>
        <h3>Mes véhicules</h3>
        {cars.length === 0 ? (
        <p>Aucun véhicule</p>
        ) : (
        <ul className="car-list">
        {cars.map((car) => (
            <li key={car._id} className="car-item">
            Marque : {car.manufacturer} | Modele : {car.model} | Année : ({car.year}) | Couleur : {car.color}
            <br />
            Type : {car.carType} | Climatisation : {car.airConditioner ? "Oui" : "Non"}
            <div className="car-actions">
                <button onClick={() => handleEditCar(car._id)}>Modifier</button>
                <button onClick={() => handleDeleteCar(car._id)}>Supprimer</button>
            </div>
            </li>
        ))}
        </ul>
        )}

        <h3>Mes trajets créés</h3>
        {myJourneys.length === 0 ? (
        <p>Vous n'avez pas encore créé de trajet</p>
        ) : (
        <ul className="mes-trajets">
            {myJourneys.map(j => ( //je recupere en dictionnaire tous les trajets créés par mon user et je vais pour chaque id de trajet afficher les infos
            <li key={j._id}> 
                {j.starting.city} vers {j.arrival.city} le {new Date(j.date).toLocaleDateString()} à {new Date(j.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
                {j.seats.left} places restantes sur les {j.seats.total} <br />
                <div className="car-actions">
                <button onClick={() => navigate(`/modifier-trajet/${j._id}`)}>Modifier</button>
                <button onClick={() => handleDeleteJourney(j._id)}>Supprimer</button>
                </div>
            </li>
            ))}
        </ul>
        )}
        <h3>Mes trajets terminés en tant que conducteur</h3>
        {myFinishedJourneys.length === 0 ? (
        <p>Aucun trajet terminé</p>
        ) : (
        <ul className="mes-trajets">
            {myFinishedJourneys.map(j => (
            <li key={j._id}>
                {j.starting.city} vers {j.arrival.city} le{" "}
                {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />
                {j.seats.total - j.seats.left} passagers 
            </li>
            ))}
        </ul>
        )}
        <h3>Mes trajets réservés</h3>
        {reservedJourneys.length === 0 ? (
        <p>Aucune réservation effectuée</p>
        ) : (
        <ul className="mes-trajets">
            {reservedJourneys.enCours.map(j => (
            <li key={j._id}>
                {j.starting.city} → {j.arrival.city} <br />
                Adresse de départ : {j.starting.address}<br />
                Adresse d'arrivée : {j.arrival.address}<br />
                le{" "}
                {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br />
                <div className="car-actions">
                <button onClick={() => handleCancelReservation(j.reservationId)}>Annuler la reservation</button>
            </div>
            </li>
            ))}
        </ul>
        )}
        <h3>Mes trajets en tant que passager terminés</h3>
        {reservedJourneys.termines.length === 0 ? (
        <p>Aucun trajet terminé pour l’instant</p>
        ) : (
        <ul className="mes-trajets">
            {reservedJourneys.termines.map(j => (
            <li key={j._id}>
                {j.starting.city} → {j.arrival.city}<br />
                Adresse de départ : {j.starting.address}<br />
                Adresse d'arrivée : {j.arrival.address}<br />
                le {new Date(j.date).toLocaleDateString()} à{" "}
                {new Date(j.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br />
                <div className="car-actions">
                <button onClick={() => navigate(`/ajouter-avis/${j.ownerId}`)}>Laisser un avis au conducteur</button>
                </div>
            </li>
            ))}
        </ul>
        )}
    </div>
    );
};

export default Profil;
