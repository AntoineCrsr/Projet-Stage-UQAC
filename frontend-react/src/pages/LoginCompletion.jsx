import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

import { useTranslation } from "react-i18next";

const LoginCompletion = () => {
  const { t } = useTranslation("login");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");

    const [phonePrefix, setPhonePrefix] = useState("+1");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneType, setPhoneType] = useState("mobile");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !gender || !birthDate) {
        setError("Merci de remplir tous les champs.");
        return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("USER ID:", userId);
    if (!token || !userId) {
      setError("Informations utilisateur manquantes. Veuillez vous reconnecter.");
      return;
    }


    try {
        const res = await fetch(`http://localhost:3000/api/auth/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            user: {
              name: {
                  firstName,
                  lastName,
              },
            gender,
            dateBirthday: new Date(birthDate).toISOString(),
            phone: {
              type: phoneType,
              prefix: phonePrefix,
              number: phoneNumber,
            }
          },
        }),
    });
      console.log(res)
      if (res.status === 400) {
        setError("Champs invalides");
        return;
      }

      if (res.status === 401) {
        setError("Non autorisé, vous devez avoir au moins 16 ans");
        return;
      }

      if (res.status === 409) {
        setError("téléphone déjà utilisé");
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }
      // MAJ nom localstorage
      localStorage.setItem("userName", `${firstName} ${lastName}`);
      window.dispatchEvent(new Event("storage"));
      navigate("/"); // retour à l'accueil une fois le formulaire complété (pas encore testé)
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi des données");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{t("completeProfile")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("firstName")}</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>{t("lastName")}</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>{t("gender")}</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">{t("selectGender")}</option>
              <option value="homme">{t("male")}</option>
              <option value="femme">{t("female")}</option>
              <option value="autre">{t("other")}</option>
            </select>
          </div>

          <div className="input-group">
            <label>{t("birthDate")}</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>

          <div className="input-group">

            <label>{t("firstName")}</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
              >
                <option value="+1">+1 (CAN/US)</option>
                <option value="+33">+33 (FR)</option>
              </select>

              <input
                type="tel"
                placeholder={t("phoneNumber")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              
              <select
                value={phoneType}
                onChange={(e) => setPhoneType(e.target.value)}
              >
                <option value="mobile">Mobile</option>
                <option value="fixe">{t("landline")}</option>
                <option value="pro">{t("work")}</option>
              </select>
            </div>
          </div>
          <button className="form" type="submit">{t("submitCompletion")}</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginCompletion;
