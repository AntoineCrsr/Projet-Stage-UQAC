import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/creerTrajet.css";

const CreerTrajet = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    carId: "",
    startingCity: "",
    startingAdress: "",
    arrivalCity: "",
    arrivalAdress: "",
    date: "",
    totalSeats: 1,
    price: 0,
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
      });
  }, [token, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const journey = {
      carId: form.carId,
      starting: {
        city: form.startingCity,
        adress: form.startingAdress,
      },
      arrival: {
        city: form.arrivalCity,
        adress: form.arrivalAdress,
      },
      date: form.date,
      seats: {
        total: parseInt(form.totalSeats),
        left: parseInt(form.totalSeats),
      },
      price: parseFloat(form.price),
      state: "disponible",
    };

    try {
      const res = await fetch("http://localhost:3000/api/journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ journey }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création du trajet.");
      alert("Trajet créé avec succès !");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (errorMsg) return <p className="error-msg">{errorMsg}</p>;

  return (
    <div className="creer-trajet-container">
      <h2>Créer un trajet</h2>
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

        <input type="text" name="startingCity" placeholder="Ville de départ" onChange={handleChange} required />
        <input type="text" name="startingAdress" placeholder="Adresse de départ" onChange={handleChange} required />
        <input type="text" name="arrivalCity" placeholder="Ville d’arrivée" onChange={handleChange} required />
        <input type="text" name="arrivalAdress" placeholder="Adresse d’arrivée" onChange={handleChange} required />
        <input type="datetime-local" name="date" onChange={handleChange} required />
        <input type="number" name="totalSeats" min="1" placeholder="Places disponibles" onChange={handleChange} required />
        <input type="number" name="price" step="0.01" placeholder="Prix (en $ CAD)" onChange={handleChange} required />

        <button type="submit">Créer le trajet</button>
      </form>
    </div>
  );
};

export default CreerTrajet;
