To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"


En cours:

TODO:
> Réalisation des avis (modification) + calculer les statistiques en fonction des avis de la db
> Fin automatique des journeys
> Mise à jour des statistiques utilisateur quand le trajet a été fini
> Vérification de l'âge de l'utilisateur
> Vérifier les adresses avec l'API google maps?
> Vérifier la cohérence des attributs de car (couleur, model etc.) // model --> API voiture ?
> Si demandé, faire de l'abstraction sur les erreurs
> Test de l'app incluant les erreurs
> Documentation



Les routes:

Pour chaque "auth required", cela signifie avoir un header Authorization avec comme contenu "Bearer {TOKEN}", avec TOKEN le token obtenu avec le login.  