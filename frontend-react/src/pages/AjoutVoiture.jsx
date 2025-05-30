import { useState, useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/ajoutvoiture.css";

import { useTranslation } from "react-i18next";

const AjoutVoiture = () => {
    const { t } = useTranslation("ajoutvoiture");

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
    ...prev,//mettre les valeurs de bases du form donc ici vide
    [name]: type === "checkbox" ? checked : value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("car", JSON.stringify(car)); // test du formDATA pour l'eventuel ajout des images pour la suite

    const url = carId //si l'id est renseigné, alors va envoyer la modif, sinon envoie la creation
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
        <h2>{carId ? t("modify") : t("title")}</h2>
        <form onSubmit={handleSubmit} className="ajout-voiture-form">
            {t("name")}
            <input type="text" name="name" placeholder={t("name")} value={car.name} onChange={handleChange} required />
            Type
            <input type="text" name="carType" placeholder="Type (SUV...)" value={car.carType} onChange={handleChange} required />
            {t("brand")}
            <input type="text" name="manufacturer" placeholder={t("brand")} value={car.manufacturer} onChange={handleChange} required />
            {t("model")}
            <input type="text" name="model" placeholder={t("model")} value={car.model} onChange={handleChange} required />
            {t("year")}
            <input type="text" name="year" placeholder={t("year")} value={car.year} onChange={handleChange} required />
            {t("color")}
            <input type="text" name="color" placeholder={t("color")} value={car.color} onChange={handleChange} required />
            {t("license")}
            <input type="text" name="licensePlate" placeholder={t("license")} value={car.licensePlate} onChange={handleChange} required />
            <label>
            <input type="checkbox" name="airConditioner" checked={car.airConditioner} onChange={handleChange} />
            {t("airConditioning")}
            </label>
            <button type="submit">{carId ? t("edit") : t("add")}</button>
        </form>
        <button onClick={() => navigate("/profil")}>{t("back")}</button>
        </div>
    );
};

export default AjoutVoiture;
