import "./styles/footer.css";
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
        <div className="footer-logos">
          <div className="footer-logo">Logo1</div>
          <div className="footer-logo">Logo2</div>
          <div className="footer-logo">Logo3</div>
          <div className="footer-logo">Logo4</div>
        </div>
      </div>

      {/*ligne de base pour les droits d'auteur (je sais pas si c'est vraiment utile mais c'est good :) */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Travel Express - Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;