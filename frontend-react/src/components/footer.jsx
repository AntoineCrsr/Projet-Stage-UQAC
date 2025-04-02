import "./styles/footer.css";
import { FaGithub, FaLinkedin} from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-divider"></div>

      <div className="footer-wrapper">
        {/* Trois colonnes pour les futurs liens */}
        <div className="footer-columns">
          <div className="footer-column">
            <ul>
              <li><a href="#">Je fais un super test</a></li>
              <li><a href="#">Lien 2</a></li>
              <li><a href="#">Lien 3</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><a href="#">Pour voir l'espacement des colonnes</a></li>
              <li><a href="#">Lien 5</a></li>
              <li><a href="#">Lien 6</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li><a href="#">avec des longs nom de liens pour les redirections</a></li>
              <li><a href="#">Lien 8</a></li>
              <li><a href="#">Lien 9</a></li>
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