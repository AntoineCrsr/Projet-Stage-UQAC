# ROUTES DETAILS [FR]

Voici le présentation détaillée de chaque route de l'API.

Le document s'organise comme suit:
1. Les routes sont triées par thème (user, journey, car etc.)
2. Pour chaque thème, les routes sont triées par nature (GET, POST, PUT, etc.)
3. Pour chaque nature, les routes seront triées par ordre alphabétique

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

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "Impossible de rechercher un utilisateur avec un identifiant invalide."