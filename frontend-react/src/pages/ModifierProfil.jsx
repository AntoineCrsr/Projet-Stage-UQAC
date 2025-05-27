import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/modifierprofil.css";

import { useTranslation } from 'react-i18next';

const ModifierProfil = () => {
    const { t } = useTranslation('profil');

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
        <h2>{t('modifyInformations')}</h2>

        <label>{t('profilePicture')} : </label>
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
        {t('phone')}
        <select name="phoneType" value={form.phoneType} onChange={handleChange} required>
        <option value="">{t('select')}</option>
        <option value="mobile">Mobile</option>
        <option value="fixe">{t('landline')}</option>
        <option value="pro">{t('pro')}</option>
        </select>

        {t('prefix')} :
        <input type="text" name="phonePrefix" value={form.phonePrefix} onChange={handleChange} required />

        {t('number')} :
        <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />    
        Email : <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        {t('publicName')} : <input type="text" name="publicName" placeholder={t('publicName')} value={form.publicName} onChange={handleChange} required />
        {t('firstName')} :<input type="text" name="firstName" placeholder={t('firstName')} value={form.firstName} onChange={handleChange} required />
        {t('lastName')} :<input type="text" name="lastName" placeholder={t('lastName')} value={form.lastName} onChange={handleChange} required />
        {t('gender')} : <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">{t('selectGender')}</option>
            <option value="homme">{t('male')}</option>
            <option value="femme">{t('female')}</option>
            <option value="autre">{t('other')}</option>
        </select>
        <label>
            <input type="checkbox" name="isStudent" checked={form.isStudent} onChange={handleChange} />
            {t('student')}
        </label>
        <textarea name="aboutMe" value={form.aboutMe} onChange={handleChange} placeholder={t('about')} />
        <button type="submit">{t('update')}</button>
        </form>
    </div>
    );
};

export default ModifierProfil;
