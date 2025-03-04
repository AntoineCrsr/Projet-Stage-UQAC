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
      </main>
    </div>
  );
};

export default Home;