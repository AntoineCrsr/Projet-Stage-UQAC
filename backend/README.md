To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"


En cours:
> Réservation de trajet

TODO:
> Faire en sorte que quand une journey est supprimée, cela supprime aussi les réservations associées
> Login error si le signup est incomplet, IDEM pour la création de journeys etc. 
> Réalisation des avis
> Vérifier les adresses avec l'API google maps?
> Vérifier la cohérence des attributs de car (couleur, model etc.) // model --> API ?
> Test de l'app incluant les erreurs
> Documentation



Les routes:

Pour chaque "auth required", cela signifie avoir un header Authorization avec comme contenu "Bearer {TOKEN}", avec TOKEN le token obtenu avec le login.  