import React from "react";
import Header from "../components/header";
import "./styles/home.css";
import JourneyForm from "../components/journeyForm";
import JourneyList from "../components/journeyList";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  return (
    <div>
      <main>
      {token && (
        <button className="creer-trajet" onClick={() => navigate("/creer-trajet")}>
          Créer un trajet
        </button>
      )}
        <JourneyForm />
        <JourneyList />
        {/*Faire attention l'entrée texte du form passe au dessus du header quand scroll*/}
      </main>
    </div>
  );
};

export default Home;