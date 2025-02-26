To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"


The API:
Pour l'instant, on peut:
> Signup
> Login
> Créer, modifier, supprimer des trajets

En cours:
> Création des voitures