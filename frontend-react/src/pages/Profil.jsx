import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profil.css";

const Profil = () => {
    const [user, setUser] = useState(null);
    const [isStudent, setIsStudent] = useState(false);
    const [aboutMe, setAboutMe] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => { //securité si quelqu'un n'est pas connecté mais appelle la route quand meme
    if (!token || !userId) {
        navigate("/login");
        return;
    }

    fetch(`http://localhost:3000/api/auth/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
        setUser(data);
        setIsStudent(data.isStudent || false);
        setAboutMe(data.aboutMe || "");
        if (data.imageUrl) setImagePreview(data.imageUrl);
        })
        .catch((err) => console.error("Erreur chargement profil :", err));
    }, [userId, token, navigate]);

    const handleImageUpload = (e) => {    // Envoie au backend à rajouter pour enregister l'image 
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = () => {
    fetch(`http://localhost:3000/api/auth/${userId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
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
        {imagePreview && (
            <img src={imagePreview} alt="profil" className="profil-image" />
        )}
        </div>

        <div className="profil-section">
        <strong>Nom :</strong> {user.name?.firstName} {user.name?.lastName}</div>
        
        <div className="profil-section">
        <strong>Nom public :</strong> {user.name?.publicName}</div>
        
        {/* <div className="profil-section"> //pas des infos accessibles dans la route que j'utilise, je cherche encore un moyen de les recup
        <strong>Email :</strong> {user.email}</div>
        
        <div className="profil-section">
        <strong>Genre :</strong> {user.gender}</div>
        
        <div className="profil-section">
        <strong>Date de naissance :</strong>{" "}
        {new Date(user.dateBirthday).toLocaleDateString()}</div> */}
        

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

        <div className="profil-buttons">
        <button onClick={handleSave}>Enregistrer</button>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
        </div>
    </div>
    );
};

export default Profil;
