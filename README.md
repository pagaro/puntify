# Projet Puntify

Ce projet est un service de streaming de musique simple, réalisé avec MongoDB, FastAPI et React. Il contient une API pour interagir avec la base de données MongoDB, une interface utilisateur React et un script de configuration pour initialiser la base de données.

## Fonctionnalités

* Gestion de musique _CRUD_
* Gestion de user _CRUD_
* _Streaming_ des musiques
* Authentification utilisateur avec _Cookies_
* Api _REST full_
* _Utilisateur_ et _Music_ initialiser au démarrage 

## Installation et configuration

1. Clonez ce dépôt sur votre machine locale.
2. Installez `Docker` et `Docker Compose` si vous ne les avez pas déjà installés.
3. Exécutez `docker-compose up -d` pour démarrer les services définis dans le fichier docker-compose.yml en arrière-plan :
   * _db_ : Service MongoDB.
   * _db-express_ : Service Mongo Express pour l'interface web de gestion de la base de données.
   * _api_ : Service de l'API back-end avec FastAPI.
   * _app_ : Service de l'APP front-end avec React.
   * _setup-music_ : Service de configuration pour initialiser la base de données.

   L'option `-d` permet de lancer les services en mode détaché (_arrière-plan_). Lorsque vous exécutez cette commande, Docker Compose crée et démarre les conteneurs pour chaque service défini dans le fichier `docker-compose.yml`. La base de données est automatiquement initialisée avec les données du script `mongo-init.js` et `setup-music.py`.
4. Ouvrez votre navigateur et accédez à `http://localhost:3000` pour voir l'interface utilisateur de l'application.
5. Accédez à `http://localhost:8081` pour gérer votre base de données MongoDB via l'interface web Mongo Express.

## Structure du projet

* _api/_ : Code source de l'API back-end développée avec FastAPI.
* _app/_ : Code source de l'application front-end développée avec React.
* _docker-compose.yml_ : Fichier de configuration Docker Compose pour orchestrer les services.
* _mongo-init.js_ : Script d'initialisation de la base de données MongoDB.
* _setup_music/_ : Script d'initialisation de la base de données MongoDB. _setup_music_ ajoute les musics à la base de données
* _.env_ : Fichier contenant les variables d'environnement pour le projet (à créer).

## Initialisation de la base de données

Le script `mongo-init.js` crée la base de données puntify, un utilisateur pour l'API et insère des utilisateurs de test. Les utilisateurs de test créés sont `toto@gmail.com` et `titi@gmail.com` avec le mot de passe `123` pour les deux. Vous pouvez modifier ce script pour ajouter d'autres données initiales ou pour changer les données des utilisateurs de test.

Le script `setup_music/setup_music.py` ajoute automatiquement les musiques qui sont dans le dossier setup_music à la base de données lors de l'exécution de la commande `docker-compose up`. Pour ajouter des musiques à la base de données, placez-les dans le dossier `setup_music` avant d'exécuter `docker-compose up -d`. Le service setup-music est responsable de l'ajout de ces musiques à la base de données.

Lors de l'exécution de la commande `docker-compose up -d`, la base de données sera initialisée avec les données définies dans le script `mongo-init.js` et les musiques du dossier `setup_music` seront ajoutées à la base de données par le service `setup-music`.

## Utilisation de Docker Compose

Docker Compose est un outil pour définir et exécuter des applications multi-conteneurs Docker. Il utilise un fichier de configuration YAML pour décrire les services, les réseaux et les volumes nécessaires pour votre application.

Pour lancer les services définis dans le fichier docker-compose.yml, exécutez la commande suivante à la racine du projet :

```docker-compose up -d```
 
Cette commande démarrera les services en mode détaché, ce qui signifie qu'ils s'exécuteront en arrière-plan.

Pour arrêter les services, exécutez la commande suivante :


```docker-compose down```

Si vous souhaitez consulter les journaux des services en cours d'exécution, utilisez la commande suivante :


```docker-compose logs -f <service_name>```

Remplacez <service_name> par le nom du service dont vous souhaitez