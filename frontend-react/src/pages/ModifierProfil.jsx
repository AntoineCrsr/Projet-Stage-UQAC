import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/modifierprofil.css";

const ModifierProfil = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({
        email: "",
        gender: "",
        publicName: "",
        firstName: "",
        lastName: "",
        isStudent: false,
        aboutMe: "",
        phoneType: "",
        phonePrefix: "",
        phoneNumber: "",
        
    });
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/api/auth/${userId}?private=true`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            setForm({
            email: data.email || "",
            gender: data.gender || "",
            publicName: data.name?.publicName || "",
            firstName: data.name?.firstName || "",
            lastName: data.name?.lastName || "",
            isStudent: data.isStudent || false,
            aboutMe: data.aboutMe || "",
            phoneType: data.phone?.type || "",
            phonePrefix: data.phone?.prefix || "",
            phoneNumber: data.phone?.number || "",
            });
        });
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const userData = {
            email: form.email,
            gender: form.gender,
            isStudent: form.isStudent,
            aboutMe: form.aboutMe,
            name: {
                publicName: form.publicName,
                firstName: form.firstName,
                lastName: form.lastName,
            },
            phone: {
                type: form.phoneType,
                prefix: form.phonePrefix,
                number: form.phoneNumber,
            },
            };
        
            formData.append("user", JSON.stringify(userData));
            if (selectedFile) {
            formData.append("image", selectedFile);
            }
        
            fetch(`http://localhost:3000/api/auth/${userId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur de mise à jour");
                alert("Profil mis à jour !");
                navigate("/profil");
            })
            .catch(() => alert("Erreur lors de la mise à jour"));
        };

    return (
    <div className="modifier-profil-container">
        <h2>Modifier mes informations</h2>

        <label>Photo de profil :</label>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            }}
        />
        {imagePreview && <img src={imagePreview} alt="Prévisualisation" style={{ width: "120px", margin: "10px 0" }} />}

        <form onSubmit={handleSubmit} className="modifier-profil-form">
        Type de téléphone :
        <select name="phoneType" value={form.phoneType} onChange={handleChange} required>
        <option value="">Sélectionner</option>
        <option value="mobile">Mobile</option>
        <option value="fixe">Fixe</option>
        </select>

        Indicatif (ex: +1) :
        <input type="text" name="phonePrefix" value={form.phonePrefix} onChange={handleChange} required />

        Numéro :
        <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />    
        Addresse mail :<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        Pseudo publique : <input type="text" name="publicName" placeholder="Nom public" value={form.publicName} onChange={handleChange} required />
        Prenom(s) :<input type="text" name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} required />
        Nom de famille :<input type="text" name="lastName" placeholder="Nom de famille" value={form.lastName} onChange={handleChange} required />
        Genre : <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Choisir un genre</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
        </select>
        <label>
            <input type="checkbox" name="isStudent" checked={form.isStudent} onChange={handleChange} />
            Je suis étudiant(e)
        </label>
        <textarea name="aboutMe" value={form.aboutMe} onChange={handleChange} placeholder="À propos de moi" />
        <button type="submit">Mettre à jour</button>
        </form>
    </div>
    );
};

export default ModifierProfil;
