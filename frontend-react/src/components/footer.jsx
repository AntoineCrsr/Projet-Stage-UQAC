import "./styles/footer.css";
import { FaGithub, FaLinkedin} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-divider"></div>

      <div className="footer-wrapper">
        {/* Trois colonnes pour les futurs liens */}
        <div className="footer-columns">
          <div className="footer-column">
            <ul>
              <li><b>Notre projet : </b></li>
              <li><Link to="/a-propos">À propos du projet</Link></li>
              <li><Link to="notre-equipe">Notre équipe </Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><b>Accès rapides : </b></li>
              <li><Link to="/creer-trajet">Créer un trajet</Link></li>
              <li><a href="#">Rechercher un trajet</a></li>
              <li><Link to="/profil">Mes réservations</Link></li>
              <li><Link to="/profil">Mes véhicules</Link></li>
              <li><a href="#">Foire aux questions (FAQ)</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><b>Informations importantes : </b></li>
              <li><a href="#">Conditions générales d’utilisation</a></li>
              <li><a href="#">Politique de confidentialité</a></li>
              <li><a href="#">Mentions légales</a></li>
              <li><a href="#">Signaler un problème</a></li>
            </ul>
          </div>
        </div>

        {/* Logos de réseaux sociaux à rajouter encore (est ce qu'on créé les reseaux aussi ?)*/}
        {/* <div className="footer-logos">
          <div className="footer-logo">Logo1</div>
          <div className="footer-logo">Logo2</div>
          <div className="footer-logo">Logo3</div>
          <div className="footer-logo">Logo4</div>
        </div> */}
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

      {/*ligne de base pour les droits d'auteur (je sais pas si c'est vraiment utile mais c'est good :) */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Travel Express - Tous droits réservés à Crauser Antoine et Jost Victor</p>
      </div>
    </footer>
  );
};

export default Footer;