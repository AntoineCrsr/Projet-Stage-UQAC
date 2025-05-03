import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginCompletion from "./pages/LoginCompletion";
import Footer from "./components/footer";
import JourneyDetails from "./components/journeyDetails";
import "./theme.css";
import Header from "./components/header";
import Profil from "./pages/Profil";
import AjoutVoiture from "./pages/AjoutVoiture";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: 1 }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/journey/:id" element={<JourneyDetails />} />
          <Route path="/login/completion" element={<LoginCompletion />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/ajout-voiture" element={<AjoutVoiture />} />
          <Route path="/modifier-voiture/:carId" element={<AjoutVoiture />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);