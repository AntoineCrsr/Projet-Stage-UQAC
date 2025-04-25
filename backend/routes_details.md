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

Si le user renseigné n'est pas trouvé, renvoie un 404 avec "L'utilisateur n'a pas été trouvé."

Si l'utilisateur n'est pas connecté, renvoie un 401 avec code = "unauthorized" et name = "L'utilisateur doit être connecté pour effectuer cette action.".

Si le user n'est pas le propriétaire du compte, renvoie 401 avec code = "unauthorized" et name = "Vous n'êtes pas autorisé à modifier un objet dont vous n'êtes pas le propriétaire."

Si l'utilisateur tente de modifier un téléphone vers un qui existe déjà, renvoie un 409 avec "Un utilisateur utilise déjà ce numéro de téléphone." et code = "conflict"

Si l'utilisateur tente de modifier un email vers un qui existe déjà, renvoie un 409 avec "Un utilisateur utilise déjà cette email."

Quand la modification a réussi, renvoie un 200 avec un header location pointant vers l'utilisateur modifié. 



### Car

#### GET /car/id

Si l'identifiant renseigné n'est pas dans un format valide (24 charactères a-z, A-Z, 0-9), renvoie un status 400 avec un objet d'erreur. Le nom de l'erreur doit être "bad-request", et le message "L'identifiant renseigné n'est pas dans un format acceptable.".

Si la voiture existe, renvoie un status 302 avec toutes les infos de la voiture enregistrée. 

Si elle n'existe pas, renvoie un 404 avec code = "not-found" et name = "La voiture n'a pas été trouvée.". 