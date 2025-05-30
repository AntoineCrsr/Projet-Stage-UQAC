# Travel Express 🚗

Application web de covoiturage conçue dans le cadre d’un projet de stage à l’UQAC. Elle permet principalement aux utilisateurs de rechercher, créer, réserver et évaluer des trajets à travers le Québec.

## Structure du projet

Projet-Stage-UQAC/

backend/ # API Node.js (Express + MongoDB)

frontend-react/ # Frontend React avec Vite

README.md # Documentation (ce fichier)

.gitignore

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- Node.js (version ≥ 18)
- npm
- MongoDB
  -VSCode pour ouvrir le projet
  -Eventuellement DockerDesktop pour l'API si vous décidez de ne pas le lancer avec node.

## Installation

Récuperer le .zip du projet ou aller le cloner directement sur le git du projet :
https://github.com/AntoineCrsr/Projet-Stage-UQAC.git

Backend :

Ensuite il faudra se mettre à la racine du projet et aller tout d'abord dans les dossier backend,
puis en tapant la commande : npm install

cd .\backend\
npm install

Une fois que les téléchargements sont terminés, vous pourrez lancer le serveur avec node serveur, ou aller voir dans le readme du dossier backend pour savoir comment le lancer avec l'API

D'ailleurs il vous faudra le .env du projet pour avoir accès à l'API, qui vous sera transmis à part pour des raisons de
sécurité.

Frontend :

Il faudra faire la même chose dans le dossier frontend, donc revenir à la racine du projet et faire :

cd .\frontend-react\
npm install

et enfin : npm run dev
Ce qui va lancer le site et vous avez juste à cliquer sur le lien affiché dans le terminal après avoir tappé cette dernière commande.

## A propos des tests

De nombreux tests ont été effectué coté API pour vérifier le bon fonctionnement de toutes les routes et fonctionnalités.
Ils se trouvent dans le sous dossier du backend nommé tests.

Merci beaucoup !

Antoine Crauser et Victor Jost
