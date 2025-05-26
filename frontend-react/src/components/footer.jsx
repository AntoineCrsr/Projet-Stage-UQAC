import "./styles/footer.css";
import { FaGithub, FaLinkedin} from "react-icons/fa";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <footer className="footer-container">
      <div className="footer-divider"></div>

      <div className="footer-wrapper">
        <div className="footer-columns">
          <div className="footer-column">
            <ul>
              <li><b><u>{t("project.title")}</u></b></li>
              <li><Link to="/a-propos">{t("project.about")}</Link></li>
              <li><Link to="notre-equipe">{t("project.team")}</Link></li>
              <li><Link to="/nous-contacter">{t("project.contact")}</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><b><u>{t("shortcuts.title")}</u></b></li>
              <li><Link to="/creer-trajet">{t("shortcuts.create")}</Link></li>
              <li><Link to="/">{t("shortcuts.search")}</Link></li>
              <li><Link to="/profil">{t("shortcuts.reservations")}</Link></li>
              <li><Link to="/profil">{t("shortcuts.cars")}</Link></li>
              <li><Link to="/faq">{t("shortcuts.faq")}</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><b><u>{t("legal.title")}</u></b></li>
              <li><a href="#">{t("legal.terms")}</a></li>
              <li><a href="#">{t("legal.privacy")}</a></li>
              <li><a href="#">{t("legal.legalNotice")}</a></li>
              <li><a href="#">{t("legal.report")}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-logos">
        <a href="https://github.com/AntoineCrsr" target="_blank" rel="noopener noreferrer">
          <FaGithub size={40} />
        </a>
        <a href="https://github.com/Zarcoks" target="_blank" rel="noopener noreferrer">
          <FaGithub size={40} />
        </a>
        <a href="https://www.linkedin.com/in/antoine-crauser/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={40} />
        </a>
        <a href="https://www.linkedin.com/in/victor-jost-562420255/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={40} />
        </a>
      </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Travel Express - {t("copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;