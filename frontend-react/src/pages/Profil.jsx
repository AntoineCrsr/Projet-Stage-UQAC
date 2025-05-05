import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profil.css";

const Profil = () => {
    const [user, setUser] = useState(null);
    const [isStudent, setIsStudent] = useState(false);
    const [aboutMe, setAboutMe] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [myJourneys, setMyJourneys] = useState([]);
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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
        
        // Validation automatique de l'email
        if (!data.hasVerifiedEmail) {
            await fetch(`http://localhost:3000/api/auth/${userId}/emailValidation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user: { nonce: "000" } }),
            });
        }

        // Validation automatique du téléphone 
        if (!data.hasVerifiedPhone) {
            await fetch(`http://localhost:3000/api/auth/${userId}/phoneValidation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user: { nonce: "000" } }),
            });
        }

        fetch(`http://localhost:3000/api/journey`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => res.json())
        .then((data) => {
            const mine = data.filter(j => j.ownerId === userId);
            setMyJourneys(mine);
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

    const handleImageUpload = (e) => {    // Envoie au backend à rajouter pour enregister l'image 
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    /*if (file) {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
        }*/
    };

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

    const handleSave = () => { //tests aussi avec formdata pour l'ajout d'images mais pas encore réussi donc on garde à l'ancienne pour le moment
        /*const formData = new FormData();
        formData.append(
            "user",
            JSON.stringify({
                isStudent,
                aboutMe,
            })
        );
        if (selectedFile) {
        formData.append("image", selectedFile);
        }*/
        fetch(`http://localhost:3000/api/auth/${userId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        //body: formData,
        body: JSON.stringify({
        user: {
            isStudent,
            aboutMe,
        },
        }),
        })
        .then((res) => {
        if (res.ok) alert("Votre profil a été mis à jour !");
        else throw new Error();
        })
        .catch(() => alert("Erreur lors de la mise à jour."));
    };

    if (!user) return <p>Chargement</p>;

    return (
    <div className="profil-container">
        <h2>Mon Profil</h2>

        <div className="profil-section">
        <label>Photo de profil :</label>
        <input type="file" onChange={handleImageUpload} />
        {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
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
        <strong>Email :</strong> {user.email}</div>
        
        <div className="profil-section"> 
        <strong>Telephone :</strong> Type {user.phone.type} : {user.phone.prefix}{user.phone.number} </div>


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
            onChange={(e) => setIsStudent(e.target.checked)}
            />
            Je suis étudiant(e)
        </label>
        </div>

        <div className="profil-section">
        <label>À propos de moi :</label>
        <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Décrivez-vous en quelques mots"
        />
        </div>

        <h3>Évaluations</h3>
        <div className="profil-info"> Ponctualité : {user.rating?.punctualityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Sécurité : {user.rating?.securityRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Confort : {user.rating?.comfortRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Courtoisie : {user.rating?.courtesyRating ?? "Pas encore évalué"}/5</div>
        <div className="profil-info"> Nombre de votes : {user.rating?.nbRating}</div>

        <h3>Statistiques</h3>
        <div className="profil-info"> Trajets complétés : {user.statistics?.nbRidesCompleted}</div>
        <div className="profil-info"> Km parcourus : {user.statistics?.nbKmTravelled}</div>
        <div className="profil-info"> Personnes rencontrées : {user.statistics?.nbPeopleTravelledWith}</div>
        <div className="profil-info"> Tonnes de CO₂ économisées : {user.statistics?.nbTonsOfCO2Saved}</div>


        <div className="profil-buttons">
        <button onClick={handleSave}>Enregistrer</button>
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
                {j.seats.left} places restantes <br />
            </li>
            ))}
        </ul>
        )}
    </div>
    );
};

export default Profil;
