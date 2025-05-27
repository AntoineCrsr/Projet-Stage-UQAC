# ROUTES DETAILS [FR]

Voici le présentation détaillée de chaque route de l'API.

Le document s'organise comme suit:
1. Les routes sont triées par thème (user, journey, car etc.)
2. Pour chaque thème, les routes sont triées par nature (GET, POST, PUT, etc.)

Vous trouverez également quelques concepts généraux en introduction de ce document. 


## CONCEPTS GENERAUX

### GetAll

Pour les routes dont le but est de renvoyer plusieurs objets, il est imposé une limite d'objets dans le tableau renvoyé. C'est pour éviter d'envoyer inutilement trop d'informations. 

Uniquement pour les routes GetAll (ou GET /objet/), il est possible de renseigner des contraintes sur les objets recherchés. Par exemple, pour obtenir tous les trajets dont la ville de départ est Chicoutimi, nous pourrions effuctuer la requête suivante:
GET /api/journey?starting=chicoutimi


## ROUTES

### User

#### GET /auth/<id>

Si l'utilisateur existe, doit renvoyer un status 302 avec les informations de l'utilisateur. Seulement, ces informations ne doivent être composées que de name, rating, aboutMe, statistics, et imageUrl. Tout autre attribut ne doit pas apparaître (parameters, email, password, isStudent etc.) SAUF si les paramètres utilisateur spécifient pour phone et email qu'ils sont consultables. 

Si l'utilisateur n'existe pas ou s'il n'a pas complété son inscription, renvoie un status 404, avec un objet d'erreur dans le corps de la requête. Le nom de l'erreur doit être "not-found", et le message "L'utilisateur n'a pas été trouvé.".

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable."


#### GET /auth/<id>?private=true
Si l'utilisateur existe, doit renvoyer un status 302 avec toutes les informations de l'utilisateur, sauf le password et les nonce.

Si l'utilisateur n'existe pas ou s'il n'a pas complété son inscription, renvoie un status 404, avec un objet d'erreur dans le corps de la requête. Le nom de l'erreur doit être "not-found", et le message "L'utilisateur n'a pas été trouvé.".

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "Impossible de rechercher un utilisateur avec un identifiant invalide."

Si l'utilisateur n'est pas connecté, renvoie un 401 avec code = "unauthorized" et name = "L'utilisateur doit être connecté pour effectuer cette action.".


#### POST /auth/signup

La requête contient dans son corps un email et un mot de passe. 

Si l'email n'est pas dans un format cohérent (@, .fr, .com etc.) retourne un status 400 avec une erreur de nom "bad-request" et de message "L'email n'est pas valide.". Ne doit pas contenir de header location. 

S'il existe déjà un compte utilisateur enregistré dans la base avec l'email valide renseigné, alors retourne un status 409 avec une erreur de nom "conflict" et un message "Un utilisateur utilise déjà cette email.". Ne doit pas contenir de header location. 

Si le type des données n'est pas valide (string, number etc.), renvoie une erreur 400 "bad-request" avec comme message "Le type des données ne correspond pas aux attendus."

Si tout est valide, crée un utilisateur dans la base de données, et renvoie une réponse contenant un header avec une location appropriée (de forme /api/auth/<id>)


#### POST /auth/login

La requête contient dans son corps un email et un mot de passe.

S'il ne contient pas au moins un des deux, renvoie un 400 avec une erreur de code "bad-request" et de message "La requête de login doit contenir un email (string) et un password (string).". 

Si l'email existe dans la base de données, mais que le mot de passe ne correspond pas avec celui enregistré, ou que l'email n'existe pas, renvoie un 403 avec code "forbidden" et name "La paire login / mot de passe est incorrecte.".

Si l'email existe et que le mot de passe correspond à celui enregistré, renvoie un 200 avec un _id correspondant à celui du user, et un token JWT. 


#### PUT /auth/<id>

La requête contient au moins un des éléments suivants: email, password, name, phone, dateBirthday, aboutMe, alternateEmail, testimonial, isStudent, parameters

S'il ne contient aucun de ces éléments, retourne un status 400 avec une erreur de code "bad-request", name "Votre requête ne contient aucun attribut.".

Si l'id du user à modifier est incorrecte (mauvais format), renvoie un 400 avec code = "bad-request" et name = "L'identifiant renseigné n'est pas dans un format acceptable.".

Si la requete contient un élément qui n'est pas du bon type, renvoie un 400 avec erreur "bad-request", name "Les types des variables ne correspondent pas aux attendus."

Si la requete contient un email invalide, renvoie 400 avec "L'email n'est pas valide."

Si la requete contient un phone invalide, renvoie 400 avec "Le téléphone fourni est invalide."

Si la requete contient un genre invalide, renvoie 400 avec "Le genre fourni est invalide."

Si le user renseigné n'est pas trouvé, renvoie un 404 avec "L'utilisateur n'a pas été trouvé."

Si l'utilisateur n'est pas connecté, renvoie un 401 avec code = "unauthorized" et name = "L'utilisateur doit être connecté pour effectuer cette action.".

Si le user n'est pas le propriétaire du compte, renvoie 401 avec code = "unauthorized" et name = "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si l'utilisateur tente de modifier un téléphone vers un qui existe déjà, renvoie un 409 avec "Un utilisateur utilise déjà ce numéro de téléphone." et code = "conflict"

Si l'utilisateur modifie la date, et que celle-ci lui donne un âge inférieur à 16 ans, renvoie 401 "Vous devez avoir au moins 16 ans pour faire un covoiturage."

Si l'utilisateur tente de modifier un email vers un qui existe déjà, renvoie un 409 avec "Un utilisateur utilise déjà cette email."

Si le type des données n'est pas valide (string, number etc.), renvoie une erreur 400 "bad-request" avec comme message "Le type des données ne correspond pas aux attendus."

Quand la modification a réussi, renvoie un 200 avec un header location pointant vers l'utilisateur modifié. 



### Car

#### GET /car

Renvoie un tableau des voitures avec leurs informations publiques (donc ne doit pas contenir les infos privées), tableau vide si aucune n'est enregistrée. Ne doit pas renvoyer plus de 20 voitures à la fois. Status 200 OK quand on renvoie. 

Pour faciliter la recherche, il doit être possible de rechercher des voitures par leurs attributs, tels que GET /car?manufacturer=peugeot doit marcher. Pour l'instant, les recherches qui contiennent des attributs privées fonctionnent aussi. 


#### GET /car/id

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si la voiture existe, renvoie un status 302 avec les infos de la voiture enregistrée, exempté de "name" et de "licensePlate". 

Si elle n'existe pas, renvoie un 404 avec code = "not-found" et name = "La voiture n'a pas été trouvée.". 


#### GET /car/id?private=true

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si elle n'existe pas, renvoie un 404 avec code = "not-found" et name = "La voiture n'a pas été trouvée.". 

Si l'utilisateur n'est pas connecté, renvoie un 401 avec code = "unauthorized" et name = "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur qui envoie la requête n'est pas le propriétaire de cette dernière, renvoie un 401 avec code = "unauthorized" et name = "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si la voiture existe, renvoie un status 302 avec les infos de la voiture enregistrée (toutes les informations de la voiture). 


#### POST /api/car

La requete utilisateur doit contenir carType, manufacturer, year, model, color, licensePlate, airConditioner, name. 

Si la requete ne contient au moins pas un de ces attributs, renvoie 400 avec code = "bad-request" et name = "La requête ne contient pas tous les attributs nécessaires à la création de l'objet.".

Si la requête contient tous les attributs mais au moins un n'est pas dans un format valide (notamment licensePlate qui doit être composé soit de 6 chars A-Z0-9, soit de 9 A-Z0-9) renvoie 400 "bad-request", "Au moins un des attributs ne respecte pas le format attendu.".

Si la licensePlate est déjà renseignée dans la database, renvoie 409 "conflict", "Une voiture possède déjà cette plaque d'immatriculation.".

Si l'utilisateur n'est pas connecté, renvoie 401 avec "unauthorized" et name = "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur connecté n'a pas complété son inscription, renvoie 401 avec "unauthorized" et name = "L'utilisateur doit compléter son inscription pour effectuer cette action.".

Si le type des données n'est pas valide (string, number etc.), renvoie une erreur 400 "bad-request" avec comme message "Le type des données ne correspond pas aux attendus."

Sinon renvoie 201, avec un header Location pointant vers l'objet (/api/car/id)


#### PUT /api/car/id

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'id n'est pas trouvé, renvoie 404 "La voiture n'a pas été trouvée."

Si l'utilisateur est connecté mais n'est pas propriétaire du char, renvoie 401 code = "unauthorized" et name = "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si un des éléments à modifier n'est pas dans un format valide (notamment licensePlate qui doit être composé soit de 6 chars A-Z0-9, soit de 9 A-Z0-9) renvoie 400 "bad-request", "Au moins un des attributs ne respecte pas le format attendu.".

Si l'utilisateur modifie une licensePlate, mais que celle ci est déjà renseignée dans la database, renvoie 409 "conflict", "Une voiture possède déjà cette plaque d'immatriculation.".

Si le type des données n'est pas valide (string, number etc.), renvoie une erreur 400 "bad-request" avec comme message "Le type des données ne correspond pas aux attendus."

Sinon renvoie 200 avec header location. 


#### DELETE /api/car/id

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur est connecté mais n'est pas propriétaire du char, renvoie 401 code = "unauthorized" et name = "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si la voiture est enregistrée dans des trajets, alors renvoie 409, "conflict", "Vous ne pouvez pas supprimer une voiture qui est renseignée dans un trajet."

Si l'utilisateur est connecté, qu'il a le droit et que la voiture peut être supprimée, alors renvoie 200. 


### Journey

#### GET /api/journey

Renvoie un tableau de toutes les journey, avec status 200. 

Tableau vide si aucune journey ne correspond à la requête.

Il doit être possible de spécifier des contraintes à la requetes avec un query string (par exemple GET /api/journey?ownerId=xxx)

Pour optimiser les recherches, il doit également être possible les choses suivantes:
- Rechercher une journey en spécifiant une city (arrival ou starting)
- Rechercher par date minimum (exemple GET /api/journey?minDate=...)


#### GET /api/journey/<id>

Renvoie la journey dont l'id est celle de la requête, avec status 302. 

Si la journey demandée n'existe pas, renvoie 404 "not-found", "Le trajet n'a pas été trouvé."

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".



#### POST /api/journey

La requête doit contenir un starting (city + address), un arrival (city + address), un carId, une date (format ISO String), des seats (total + left), et un prix. 

Si le type de ces attributs ne correspondent pas aux attendus, renvoi "bad-request", "Le type des variables ne correspond pas aux attendus."

Si la requete ne contient au moins pas un de ces attributs, renvoie 400 avec code = "bad-request" et name = "La requête ne contient pas tous les attributs nécessaires à la création de l'objet.".

Si la date est dans un format incorrect (ne respectant pas 2011-10-10T14:48:00), renvoie 400, "La date renseignée n'est pas dans le format attendu."

Si la date renseignée pour la journey est inférieure à la date à laquelle la requete est reçue, renvoie 400 "bad-request", "La date renseignée doit être supérieure ou égale à la date actuelle."

Si le nombre de places totales ou restantes est inférieur ou égal à zero, renvoie 400 avec "bad-request", "Le nombre de places doit au moins être de 1."

Si le nombre de place restant est supérieur au nombre de place total, 400 "Le nombre de place restant doit être inférieur au nombre de place total."

Si le prix est inférieur à zero, renvoie 400, "Le prix d'un trajet ne peut pas aller en dessous de 0."

Si la voiture renseignée dans la journey n'appartient pas à l'utilisateur, renvoie 401 "unauthorized" avec "La voiture renseignée n'est pas possédée par l'utilisateur.".

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur n'a pas complété son inscription, renvoie 401, "L'utilisateur doit compléter son inscription pour effectuer cette action."

Si l'API Google de Vérification d'adresse renvoie un inputGranularity ou un validationGranularity qui ne vaut pas au moins PREMISE ou SUB_PREMISE, (ou PREMISE_PROXIMITY en supplément pour inputGranularity), renvoie un 400 code = "bad-request" et name = "L'adresse renseignée est invalide ou est trop imprécise.".

Si la province d'une des deux adresses renseignées n'est pas au Québec, renvoie 400, "Le covoiturage doit avoir lieu au Québec.".

Si tout convient, renvoie 201 sans body, avec header location. La journey doit être définie sur le state "w" (waiting), avec comme addresse le correctif de l'API GMAPS, et la ville correctif de l'API, pour starting et arrival, avec les cities en toLowerCase. 


#### PUT /api/journey/id

Contrairement à PUT de user, la modification de journey nécessite tous les attributs de cette dernière (starting (city + adress), un arrival (city + adress), un carId, une date (format ISO String), des seats (total + left), et un prix).

En cas de not found, retourner 404, "Le trajet n'a pas été trouvé."

Si l'utilisateur tente de modifier une journey déjà terminée, renvoie 401 unauthorized "Vous ne pouvez pas modifier un trajet déjà terminé.". 

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Sinon, elle constitue presque les mêmes retours que la création, soit:
Si la requete ne contient au moins pas un de ces attributs, renvoie 400 avec code = "bad-request" et name = "La requête ne contient pas tous les attributs nécessaires à la modification de l'objet.".

Si le type de ces attributs ne correspondent pas aux attendus, renvoi "bad-request", "Le type des variables ne correspond pas aux attendus."

Si la date est dans un format incorrect (ne respectant pas 2011-10-10T14:48:00), renvoie 400, "La date renseignée n'est pas dans le format attendu."

Si la date renseignée pour la journey est inférieure à la date à laquelle la requete est reçue, renvoie 400 "bad-request", "La date renseignée doit être supérieure ou égale à la date actuelle."

Si le nombre de places totales ou restantes est inférieur ou égal à zero, renvoie 400 avec "bad-request", "Le nombre de places doit au moins être de 1."

Si le nombre de place restant est supérieur au nombre de place total, 400 "Le nombre de place restant doit être inférieur au nombre de place total."

Si le prix est inférieur à zero, renvoie 400, "Le prix d'un trajet ne peut pas aller en dessous de 0."

Si la voiture renseignée dans la journey n'appartient pas à l'utilisateur, renvoie 401 "unauthorized" avec "La voiture renseignée n'est pas possédée par l'utilisateur.".

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si la journey n'appartient pas à l'utilisateur, renvoie 401 unauthorized, "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si l'API Google de Vérification d'adresse renvoie un inputGranularity ou un validationGranularity qui ne vaut pas au moins PREMISE ou SUB_PREMISE, (ou PREMISE_PROXIMITY en supplément pour inputGranularity), renvoie un 400 code = "bad-request" et name = "L'adresse renseignée est invalide ou est trop imprécise.".

Si la province d'une des deux adresses renseignées n'est pas au Québec, renvoie 400, "Le covoiturage doit avoir lieu au Québec.".

Si tout convient, renvoie 200 sans body, avec header location. La journey doit être définie sur le state "w" (waiting), avec comme addresse le correctif de l'API GMAPS, et la ville correctif de l'API, pour starting et arrival, avec les cities en toLowerCase. 


#### DELETE /api/journey/id

En cas de not found, retourner 404, "Le trajet n'a pas été trouvé."

Si l'utilisateur tente de supprimer une journey déjà terminée, renvoie 401 unauthorized "Vous ne pouvez pas supprimer un trajet déjà terminé.". 

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si la journey n'appartient pas à l'utilisateur, renvoie 401 unauthorized, "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si tout est correct, renvoie 200, body vide, et supprime les réservations associées s'il y en a. 


### Reservation

#### GET /api/reservation

Renvoie un tableau de toutes les réservations, avec status 200. 

Tableau vide si aucune réservation ne correspond à la requête.

Il doit être possible de spécifier des contraintes à la requetes avec un query string (par exemple GET /api/reservation?userId=xxx)

Si un identifiant dans les contraintes est invalide, renvoyer l'erreur "400", "L'identifiant renseigné n'est pas dans un format acceptable."


#### GET /api/reservation/id

Renvoie la réservation dont l'id est celle de la requête, avec status 302. 

Si la réservation demandée n'existe pas, renvoie 404 "not-found", "La réservation n'a pas été trouvée."

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".


#### POST /api/reservation

Doit contenir journeyId.

Si elle ne contient pas ça, renvoie 400 avec code = "bad-request" et name = "La requête ne contient pas tous les attributs nécessaires à la création de l'objet.".

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si la journey renseignée n'existe pas, renvoie 404 "not-found", "Le trajet n'a pas été trouvé."

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur n'a pas complété son inscription, renvoie 401, "L'utilisateur doit compléter son inscription pour effectuer cette action."

Si la journey à réserver appartient à l'utilisateur, renvoie 401, "Le créateur du trajet ne peut pas le réserver."

Si l'utilisateur a déjà réservé le trajet, renvoie 401, "Il est impossible de réserver plusieurs fois le même trajet."

S'il n'y a plus de place dans le trajet, renvoie 400, "Le trajet est déjà complet."

Si la journey est déjà terminée, renvoie 401, "Vous ne pouvez pas intéragir avec un trajet déjà terminé."

Sinon, renvoie 201, body vide mais avec header location. 


#### DELETE /api/reservation/id

En cas de not found, retourner 404, "La réservation n'a pas été trouvée."

Si l'utilisateur tente de supprimer une réservation sur une journey déjà terminée, renvoie 401 unauthorized "Vous ne pouvez pas supprimer une réservation sur un trajet déjà terminé.". 

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si la réservation n'appartient pas à l'utilisateur, renvoie 401 unauthorized, "Vous ne pouvez pas intéragir avec un trajet déjà terminé."

Si tout est correct, renvoie 200, body vide. 


### Review

#### GET /api/review

Renvoie un tableau de toutes les reviews, avec status 200. 

Tableau vide si aucune review ne correspond à la requête.

Il doit être possible de spécifier des contraintes à la requetes avec un query string (par exemple GET /api/review?reviewedId=xxx)

Si un identifiant dans les contraintes est invalide, renvoyer l'erreur "400", "L'identifiant renseigné n'est pas dans un format acceptable."


#### GET /api/review/id

Renvoie la review dont l'id est celle de la requête, avec status 302. 

Si la review demandée n'existe pas, renvoie 404 "not-found", "L'avis n'a pas été trouvé."

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".



#### POST /api/review

Doit contenir les attributs "reviewedId", "punctualityRating", "securityRating", "comfortRating", "courtesyRating", "message". Dont message est facultatif.

Si elle ne contient pas ça, renvoie 400 avec code = "bad-request" et name = "La requête ne contient pas tous les attributs nécessaires à la création de l'objet.".

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si un des ratings n'est pas entre 0 et 5, renvoie 400 "bad-request", "Les notes d'un avis ne peuvent être compris qu'entre 0 et 5.". 

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'utilisateur n'a effectué de trajet terminé avec l'utilisateur noté, renvoie 401 "Vous ne disposez pas de trajet complété avec le conducteur renseigné."

Si l'utilisateur tente de se noter lui-même, renvoie 401 "Vous ne pouvez pas vous donner d'avis à vous-même."

Si l'utilisateur a déjà donné un avis sur la personne, renvoie 401 "Vous ne pouvez pas donner plus d'un avis sur la même personne.". 

Sinon, renvoie 201 avec header location, et met à jour le rating du user. 


#### DELETE /api/review/id

En cas de not found, retourner 404, "L'avis n'a pas été trouvé."

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si l'utilisateur n'est pas connecté, renvoie 401 unauthorized, "L'utilisateur doit être connecté pour effectuer cette action.".

Si l'avis n'appartient pas à l'utilisateur, renvoie 401 unauthorized, "Vous n'êtes pas autorisé à éditer un objet dont vous n'êtes pas le propriétaire."

Si tout est correct, renvoie 200, body vide, et annule l'impact de la review sur la notation de l'utilisateur. 