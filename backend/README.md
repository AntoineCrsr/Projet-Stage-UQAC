To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"


En cours:
> Sécurisation (avis donnables qu'une fois par journey, à déterminer le reste)

TODO:
> Login error si le signup est incomplet, IDEM pour la création de journeys etc. 
> Transformation des cars en Service_Response
> Filtrer les données dans les fonctions get
> Lors de la modification de l'état d'une journey à 'done', update les statistiques du conducteur / passagers
> Vérifier les adresses avec l'API google maps?
> Vérifier la cohérence des attributs de car (couleur, model etc.) // model --> API ?
> Test de Journey incluant les erreurs



Les routes:

Pour chaque "auth required", cela signifie avoir un header Authorization avec comme contenu "Bearer {TOKEN}", avec TOKEN le token obtenu avec le login.  