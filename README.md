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

<<<<<<< HEAD
Une fois que les téléchargements sont terminés, vous pourrez lancer le serveur avec node serveur, ou aller voir dans le readme du dossier backend pour savoir comment le lancer avec l'API

-D'ailleurs il vous faudra le .env du projet pour avoir accès à l'API, qui vous sera transmis à part pour des raisons de
sécurité.
=======
D'ailleurs il vous faudra le .env du projet pour avoir accès à l'API, qui vous sera transmis à part pour des raisons de sécurité.
>>>>>>> 3b96efecc77d2dc831ca51adbafdfd0dca0cfadd

### Frontend :

Il faudra faire la même chose dans le dossier frontend, donc revenir à la racine du projet et faire :
<<<<<<< HEAD

cd .\frontend-react\
=======
```
cd .\frontend-react\ 
>>>>>>> 3b96efecc77d2dc831ca51adbafdfd0dca0cfadd
npm install
npm run dev
```
Ce qui va lancer le site et vous avez juste à cliquer sur le lien affiché dans le terminal après avoir tappé cette dernière commande.

## A propos des tests

De nombreux tests ont été effectué coté API pour vérifier le bon fonctionnement de toutes les routes et fonctionnalités.
Ils se trouvent dans le sous dossier du backend nommé tests.

Merci beaucoup !

Antoine Crauser et Victor Jost
