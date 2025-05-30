import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/ajouteravis.css";

import { useTranslation } from "react-i18next";
//cette page permet seulement de laisser un avis sur le conducteur UNE seule fois
//si l'avis existe déjà, l'envoie de l'avis sera tout simplement refusé, mais l'user ne pourra pas modifier son précédent avis non plus
const AjouterAvis = () => {
    const { t } = useTranslation("ajouteravis"); //récupère les traduction de la page dans la const t pour l'i18n 👈

    const { id: reviewedId } = useParams();
    const [form, setForm] = useState({ //défini des valeurs par défaut au form pour donner l'exemple
        punctualityRating: 0,
        securityRating: 0,
        comfortRating: 0,
        courtesyRating: 0,
        message: "",
    });

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value })); //prev pour récuperer les valeurs avant la modif soit les 0...
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //gestion d'erreur sur le reviewerID car on en a eu beaucoup
        if (!reviewedId) {
        alert("L'identifiant de l'utilisateur à évaluer est manquant.");
        return;
        }
    
        try {
        const res = await fetch("http://localhost:3000/api/review", { //envoie l'avis
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            review: {
                reviewedId: reviewedId,
                punctualityRating: Number(form.punctualityRating),
                securityRating: Number(form.securityRating),
                comfortRating: Number(form.comfortRating),
                courtesyRating: Number(form.courtesyRating),
                message: form.message,
            }
            }),
        });
    
        if (!res.ok) {
            const errData = await res.json();
            const message = errData?.errors?.review?.name || "Erreur lors de l'envoi de l'avis."; //recuperer l'erreur de l'API
            throw new Error(message);
        }
    
        alert("Avis envoyé avec succès !");
        navigate("/profil");
        } catch (err) {
        alert(`Erreur : ${err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-avis">
        <h3>{t("title")}</h3>

        <label>{t("punctuality")}</label>
        <input type="number" name="punctualityRating" min="0" max="5" value={form.punctualityRating} onChange={handleChange} required />

        <label>{t("security")}</label>
        <input type="number" name="securityRating" min="0" max="5" value={form.securityRating} onChange={handleChange} required />

        <label>{t("comfort")}</label>
        <input type="number" name="comfortRating" min="0" max="5" value={form.comfortRating} onChange={handleChange} required />

        <label>{t("courtesy")}</label>
        <input type="number" name="courtesyRating" min="0" max="5" value={form.courtesyRating} onChange={handleChange} required />
        <label>{t("message")}</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre commentaire (optionnel)" />
        <button type="submit">{t("submit")}</button>
        </form>
    );
};

export default AjouterAvis;
