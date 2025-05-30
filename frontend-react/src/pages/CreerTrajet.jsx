import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/creerTrajet.css";

import { useTranslation } from "react-i18next";

const CreerTrajet = () => {
  const { t } = useTranslation("creertrajet");

  const { journeyId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    carId: "",
    startingCity: "",
    startingAddress: "",
    arrivalCity: "",
    arrivalAddress: "",
    date: "",
    totalSeats: null,
    left : null,
    price: null,
  });

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/api/auth/${userId}?private=true`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasVerifiedEmail || !data.hasVerifiedPhone) {
          setErrorMsg("Votre telephone et email doivent être vérifiés d'abord");
          return;
        }
        //Modif de la récupération des voitures de l'user
        fetch(`http://localhost:3000/api/car?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((carData) => {
            if (!Array.isArray(carData) || carData.length === 0) {
              setErrorMsg("Vous devez déclarer un véhicule avant de créer un trajet");
            } else {
              setCars(carData);
            }
          })
          .catch((err) => {
            console.error("Erreur chargement véhicules :", err);
            setErrorMsg("Erreur lors de la récupération des véhicules");
          });
          //si on fourni un id de trajet
        if (journeyId) {
                  fetch(`http://localhost:3000/api/journey/${journeyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then((res) => res.json())
                    .then((j) => {
                      setForm({
                        carId: j.carId,
                        startingCity: j.starting.city,
                        startingAddress: j.starting.address,
                        arrivalCity: j.arrival.city,
                        arrivalAddress: j.arrival.address,
                        date: j.date.slice(0, 16),
                        totalSeats: j.seats.total,
                        left: j.seats.left,
                        price: j.price,
                      });
                    })
                    .catch(() => alert("Erreur de chargement du trajet"));
                }
              });
          }, [token, userId, journeyId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); //remplaces les valeurs par défaut par les valeurs récupérées pour la modif
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseInt(form.left) > parseInt(form.totalSeats)) {
      alert("Les places disponibles ne peuvent pas dépasser le nombre total de places dans le véhicule");
      return;
    }

    if (parseInt(form.left) == 0) {
      alert("Vous ne pouvez pas creer un trajet avec 0 places disponibles");
      return;
    }
    
    const journey = {
      carId: form.carId,
      starting: {
        city: form.startingCity,
        address: [form.startingAddress],
      },
      arrival: {
        city: form.arrivalCity,
        address: [form.arrivalAddress],
      },
      date: new Date(form.date).toISOString(),
      seats: {
        total: parseInt(form.totalSeats),
        left: parseInt(form.left),
      },
      price: parseFloat(form.price),
    };

    const url = journeyId //comme pour l'ajout de voiture, va permettre d'utiliser la bonne route si on a un journeyId
    ? `http://localhost:3000/api/journey/${journeyId}` : "http://localhost:3000/api/journey";

    const method = journeyId ? "PUT" : "POST";

    try {
      console.log("Données envoyées :", JSON.stringify({ journey }, null, 2));
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ journey }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const message =
          errorData?.errors?.journey?.name ||
          errorData?.errors?.journey?.message ||
          "Une erreur inconnue est survenue.";
        throw new Error(message);
      }
    
      alert(journeyId ? "Trajet modifié !" : "Trajet créé !");
      navigate("/");
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
  };

  if (errorMsg) return <p className="error-msg">{errorMsg}</p>;

  return (
    <div className="creer-trajet-container">
      <h2>{journeyId ? t("modify") : t("title")}</h2>
      <form onSubmit={handleSubmit} className="creer-trajet-form">
        <label>{t("vehicle")}</label>
        <select name="carId" value={form.carId} onChange={handleChange} required>
          <option value="">{t("vehiclePlaceholder")}</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} ({car.manufacturer} {car.model})
            </option>
          ))}
        </select>
        {t("startingCity")}
        <input type="text" name="startingCity" placeholder={t("startingCity")} value={form.startingCity} onChange={handleChange} required />
        {t("startingAddress")}
        <input type="text" name="startingAddress" placeholder={t("startingAddress")} value={form.startingAddress} onChange={handleChange} required />
        {t("arrivalCity")}
        <input type="text" name="arrivalCity" placeholder={t("arrivalCity")} value={form.arrivalCity} onChange={handleChange} required />
        {t("arrivalAddress")}
        <input type="text" name="arrivalAddress" placeholder={t("arrivalAddress")} value={form.arrivalAddress} onChange={handleChange} required />
        {t("departureDateTime")}
        <input type="datetime-local" placeholder={t("departureDateTime")} name="date" value={form.date} onChange={handleChange} required />
        {t("totalSeats")}
        <input type="number" name="totalSeats" min="1" placeholder={t("totalSeats")} value={form.totalSeats} onChange={handleChange} required />
        {t("availableSeats")}
        <input type="number" name="left" min="1" placeholder={t("availableSeats")} value={form.left} onChange={handleChange} required />
        {t("price")}
        <input type="number" name="price" step="0.01" placeholder={t("price")} value={form.price} onChange={handleChange} required />
        
        <button type="submit">{journeyId ? t("modify") : t("create")}</button>
      </form>
    </div>
  );
};

export default CreerTrajet;
