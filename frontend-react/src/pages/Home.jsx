/* import { useState } from "react";
import Header from "../components/header";
import LoginForm from "../components/loginform";


const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Header />
      <button
        className="mt-10 bg-blue-500 text-white px-6 py-3 rounded-lg"
        onClick={() => setShowLogin(true)}
      >
        Se connecter
      </button>
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Home; */

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