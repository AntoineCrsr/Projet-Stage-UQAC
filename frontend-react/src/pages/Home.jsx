import React from "react";
import Header from "../components/header";
import "./styles/home.css";
import JourneyForm from "../components/journeyForm";

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <JourneyForm />
        {/*Faire attention l'entrée texte du form passe au dessus du header quand scroll*/}
      </main>
    </div>
  );
};

export default Home;