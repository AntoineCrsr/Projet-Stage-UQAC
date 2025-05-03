import React, { useState, useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/ajoutvoiture.css";

const AjoutVoiture = () => {
    const { carId } = useParams();
    const [car, setCar] = useState({
    carType: "",
    manufacturer: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    airConditioner: false,
    name: ""
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
    if (!token) {
    navigate("/login");
    return;
    }
    if (carId) {
    fetch(`http://localhost:3000/api/car/${carId}?private=true`, {
    headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
        setCar(data);
        })
        .catch(() => alert("Erreur lors du chargement de la voiture"));
    }
}, [carId, token, navigate]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCar((prev) => ({
    ...prev,//garder les anciennes valeurs
    [name]: type === "checkbox" ? checked : value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("car", JSON.stringify(car)); // test du formDATA pour l'eventuel ajout des images pour la suite

    const url = carId //si l'id est renseigné, alors ba envoyer la modif, sinon envoie la creation
        ? `http://localhost:3000/api/car/${carId}` : "http://localhost:3000/api/car";

    const method = carId ? "PUT" : "POST"; //precise la methode pour le fetch

    try {
        const res = await fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${token}` // NE PAS ajouter Content-Type avec FormData !
        },
        body: formData
        });

        
        if (res.status === 400) {
        alert("Format ou données invalides (400)");
        return;
        }
        if (res.status === 409) {
        alert("Une voiture avec cette plaque existe déjà");
        return;
        }
        if (res.status === 401) {
        alert("Veuillez compléter votre profil avant d’ajouter une voiture");
        return;
        }
        if (!res.ok) throw new Error();

        alert(carId ? "Véhicule modifié !" : "Véhicule ajouté !");
        navigate("/profil");
    } catch (err) {
        alert(err.message);
    }
    };



    return (
        <div className="ajout-voiture-container">
        <h2>{carId ? "Modifier un véhicule" : "Ajouter un véhicule"}</h2>
        <form onSubmit={handleSubmit} className="ajout-voiture-form">
            <input type="text" name="name" placeholder="Nom du véhicule" value={car.name} onChange={handleChange} required />
            <input type="text" name="carType" placeholder="Type (SUV, Berline...)" value={car.carType} onChange={handleChange} required />
            <input type="text" name="manufacturer" placeholder="Marque" value={car.manufacturer} onChange={handleChange} required />
            <input type="text" name="model" placeholder="Modèle" value={car.model} onChange={handleChange} required />
            <input type="text" name="year" placeholder="Année" value={car.year} onChange={handleChange} required />
            <input type="text" name="color" placeholder="Couleur" value={car.color} onChange={handleChange} required />
            <input type="text" name="licensePlate" placeholder="Plaque d'immatriculation" value={car.licensePlate} onChange={handleChange} required />
            <label>
            <input type="checkbox" name="airConditioner" checked={car.airConditioner} onChange={handleChange} />
            Climatisation
            </label>
            <button type="submit">{carId ? "Modifier" : "Ajouter"}</button>
        </form>
        <button onClick={() => navigate("/profil")}>Retour</button>
        </div>
    );
};

export default AjoutVoiture;
