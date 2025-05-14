To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"
    


En cours:

TODO:
> Fin automatique des journeys (lors d'un GET = update ?)
> Mise à jour des statistiques utilisateur quand le trajet a été fini
> Vérification de l'âge de l'utilisateur
> Vérifier la cohérence des attributs de car (couleur, model etc.) // model --> API voiture ?
> Tester la sécurité