import React from "react";
import "./styles/pages-info.css";

const FAQ = () => {
  return (
    <div className="FAQ">
      <h1>Foire Aux Questions (FAQ)</h1>

      <div className="faq-item">
        <h3>1. Comment réserver un trajet ?</h3>
        <p>
          Pour réserver un trajet, il faut que vous soyez connecté sur votre compte, que vos informations personnelles soient vérifiées, 
          puis que vous consultiez la liste des trajets disponibles sur la page d'accueil
          et cliquez sur le bouton "Réserver ce trajet" dans les détails du trajet. Une confirmation vous sera demandée.
        </p>
      </div>

      <div className="faq-item">
        <h3>2. Puis-je modifier ou supprimer un trajet que j’ai créé ?</h3>
        <p>
          Oui, depuis votre page de profil, vous pouvez voir tous les trajets que vous avez créés.
          Chaque trajet possède un bouton "Modifier" et "Supprimer".
        </p>
      </div>

      <div className="faq-item">
        <h3>3. Comment déclarer un véhicule pour proposer des trajets ?</h3>
        <p>
          Depuis votre profil, cliquez sur "Ajouter un véhicule". Remplissez les informations nécessaires,
          puis vous pourrez l’utiliser pour créer des trajets.
        </p>
      </div>

      <div className="faq-item">
        <h3>4. Est-ce que je peux annuler une réservation ?</h3>
        <p>
          Oui. Accédez à votre profil, section "Mes trajets réservés", puis cliquez sur "Annuler" à côté du trajet concerné.
        </p>
      </div>

      <div className="faq-item">
        <h3>5. Comment signaler un problème ou un comportement inapproprié ?</h3>
        <p>
          Vous pouvez utiliser le lien "Signaler un problème" en bas de page dans le footer. Veillez à bien décrire la situation
          et fournir un maximum d’informations.
        </p>
      </div>
      <div className="faq-item">
        <h3>6. Que faire si un utilisateur ne se présente pas au rendez-vous ?</h3>
        <p>
        Si un conducteur ou un passager ne se présente pas, nous n'avons pas encore prévu de solutions. Vous pouvez signaler le problème via le bouton 
        “Signaler un problème” en bas de page. Nous prendrons les mesures nécessaires pour éviter les abus.
        </p>
      </div>
      <div className="faq-item">
        <h3>7. Comment puis-je évaluer un conducteur ou un passager ?</h3>
        <p>
        Après chaque trajet complété, vous pourrez laisser une évaluation 
        sur différents critères (ponctualité, confort, sécurité, etc.) directement depuis votre profil (pas encore ajouté).
        </p>
      </div>
      <div className="faq-item">
        <h3>8. Puis-je utiliser l’application sans créer de compte ?</h3>
        <p>
        Vous pouvez consulter les trajets sans compte, mais la réservation et la création de trajets 
        nécessitent une inscription et une vérification de votre email et numéro de téléphone (et d'une voiture déclarée pour la création).
        </p>
      </div>
      <div className="faq-item">
        <h3>9. Quelles sont les conditions pour créer un trajet ?</h3>
        <p>
        Pour proposer un trajet, vous devez être connecté à votre compte, avoir un véhicule déclaré, 
        et avoir un compte vérifié (email et téléphone). Vous pourrez alors utiliser le bouton qui apparaitra au dessus du formulaire de 
        recherche de trajets.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
