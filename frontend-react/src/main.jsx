import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginCompletion from "./pages/LoginCompletion";
import Footer from "./components/footer";
import JourneyDetails from "./components/journeyDetails";
import Header from "./components/header";
import Profil from "./pages/Profil";
import AjoutVoiture from "./pages/AjoutVoiture";
import CreerTrajet from "./pages/creerTrajet";

import APropos from "./pages/APropos";
import NotreEquipe from "./pages/NotreEquipe";
import FAQ from "./pages/FAQ";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: 1 }}>
        <Header />
        <Routes>
          {/* Partie principales pour les fonctionnalités */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/journey/:id" element={<JourneyDetails />} />
          <Route path="/login/completion" element={<LoginCompletion />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/ajout-voiture" element={<AjoutVoiture />} />
          <Route path="/modifier-voiture/:carId" element={<AjoutVoiture />} />
          <Route path="/creer-trajet" element={<CreerTrajet />} />
          <Route path="/modifier-trajet/:journeyId" element={<CreerTrajet />} />
          {/* Partie des routes du footer */}
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/notre-equipe" element={<NotreEquipe />} />
          <Route path="/faq" element={<FAQ/>} />
        </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);