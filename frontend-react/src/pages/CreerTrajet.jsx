import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/creerTrajet.css";

const CreerTrajet = () => {
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
        fetch("http://localhost:3000/api/car", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((carData) => {
            const myCars = carData.filter((car) => car.userId === userId); //recuperer les voitures de mon user connecté
            if (myCars.length === 0) {
              setErrorMsg("Vous devez déclarer un véhicule avant de créer un trajet");
            } else {
              setCars(myCars);
            }
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
                        startingAddress: j.starting.address[0] || "",
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
    setForm((prev) => ({ ...prev, [name]: value }));
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
      date: form.date,
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

      if (!res.ok) throw new Error("Erreur lors de l'envoi du trajet.");
      alert(journeyId ? "Trajet modifié !" : "Trajet créé !");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (errorMsg) return <p className="error-msg">{errorMsg}</p>;

  return (
    <div className="creer-trajet-container">
      <h2>{journeyId ? "Modifier un trajet" : "Créer un trajet"}</h2>
      <form onSubmit={handleSubmit} className="creer-trajet-form">
        <label>Véhicule :</label>
        <select name="carId" value={form.carId} onChange={handleChange} required>
          <option value="">Choisir votre véhicule</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} ({car.manufacturer} {car.model})
            </option>
          ))}
        </select>

        <input type="text" name="startingCity" placeholder="Ville de départ" value={form.startingCity} onChange={handleChange} required />
        <input type="text" name="startingAddress" placeholder="Adresse de départ" value={form.startingAddress} onChange={handleChange} required />
        <input type="text" name="arrivalCity" placeholder="Ville d’arrivée" value={form.arrivalCity} onChange={handleChange} required />
        <input type="text" name="arrivalAddress" placeholder="Adresse d’arrivée" value={form.arrivaldAdress} onChange={handleChange} required />
        <input type="datetime-local" placeholder="Date de départ et horaire" name="date" value={form.date} onChange={handleChange} required />
        <input type="number" name="totalSeats" min="1" placeholder="Places totales du véhicule" value={form.totalSeats} onChange={handleChange} required />
        <input type="number" name="left" min="1" placeholder="Places disponibles pour le trajet" value={form.left} onChange={handleChange} required />
        <input type="number" name="price" step="0.01" placeholder="Prix (en $ CAD)" value={form.price} onChange={handleChange} required />

        <button type="submit">{journeyId ? "Modifier le trajet" : "Créer le trajet"}</button>
      </form>
    </div>
  );
};

export default CreerTrajet;
