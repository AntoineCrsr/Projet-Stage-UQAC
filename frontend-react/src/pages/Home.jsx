import "./styles/home.css";
import JourneyForm from "../components/journeyForm";
import JourneyList from "../components/journeyList";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("creertrajet");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  return (
    <div>
      <main>
      {token && (
        <button className="creer-trajet" onClick={() => navigate("/creer-trajet")}>
          {t("title")}
        </button>
      )}
        <JourneyForm />
        <JourneyList />
      </main>
    </div>
  );
};

export default Home;