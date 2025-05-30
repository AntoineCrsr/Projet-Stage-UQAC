# Travel Express 🚗

Application web de covoiturage conçue dans le cadre d’un projet de stage à l’UQAC. Elle permet principalement aux utilisateurs de rechercher, créer, réserver et évaluer des trajets à travers le Québec.

## Structure du projet

Projet-Stage-UQAC/

backend/ # API Node.js (Express + MongoDB)

frontend-react/ # Frontend React avec Vite

README.md # Documentation (ce fichier)

.gitignore

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé npm

## Installation

Récuperer le .zip du projet ou aller le cloner directement sur le git du projet :
https://github.com/AntoineCrsr/Projet-Stage-UQAC.git

### Backend :

Ensuite il faudra se mettre à la racine du projet et aller tout d'abord dans les dossier backend,
puis en tapant la commande npm install

```
cd .\backend\
npm install
node serveur
```

Une fois que les téléchargements sont terminés, vous pourrez lancer le serveur avec node serveur mais avant n'oubliez pas de coller le .env dans le dossier backend. Sinon vous pouvez aller voir dans le readme du dossier backend pour savoir comment le lancer avec l'API

-Il vous faut le .env du projet pour avoir accès à l'API, qui vous sera transmis à part pour des raisons de
sécurité.

### Frontend :

Il faudra faire la même chose dans le dossier frontend, donc revenir à la racine du projet et faire :

```
cd .\frontend-react\
npm install
npm run dev
```

Ce qui va lancer le site et vous avez juste à cliquer sur le lien affiché dans le terminal après avoir tappé cette dernière commande.

## A propos des tests

De nombreux tests ont été effectué coté API pour vérifier le bon fonctionnement de toutes les routes et fonctionnalités.
Ils se trouvent dans le sous dossier du backend nommé tests.

Merci beaucoup !
Voici le clap de fin pour notre projet !

Ce projet a été une expérience technique enrichissante mais aussi une source de réflexion pour répondre à un besoin concret basé sur nos expériences et la situation actuelle.

Nous sommes fiers du résultat de notre projet même si nous souhaitions encore l'améliorer, et nous sommes heureux d’avoir collaboré de manière constructive tout le long de ce dernier ainsi que d’avoir enrichi nos compétences dans ce domaine du développement web.

Antoine Crauser et Victor Jost
