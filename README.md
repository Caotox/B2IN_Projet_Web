# B2IN_Projet_Web

This project involves developing a website for a company specializing in renting event spaces for various occasions: seminars, Christmas parties, birthdays, training sessions, etc.

## Key Features
- Development and usage of a REST API in JavaScript to communicate with a PostgreSQL database.
- Configuration and utilization of an NGINX server to meet the site's needs.

---

## Prerequisites
Before starting, make sure to have the following tools installed:
- [Node.js](https://nodejs.org/): Version 16 or later
- [PostgreSQL](https://www.postgresql.org/): A functional database instance
- [NGINX](https://nginx.org/): For proxy server configuration

---

## Main Dependencies
The project uses the following libraries:
- [Express](https://expressjs.com/): A web framework for Node.js
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js): A library for secure password hashing

To install all dependencies, run the following command after cloning the repository:  
```bash
npm install
```
Installation and Usage Steps
1. Clone the Repository
Clone this repository to your local machine:

```bash
git clone https://github.com/Caotox/B2IN_Projet_Web
```
1.1 Create a File for the Site
After cloning the repository, create a configuration file for your site:

```bash
sudo touch /var/www/site-available/monSite
```
1.2 Copy the Project Files
Copy all project files into the newly created directory:

```bash
sudo cp -r B2IN_Projet_Web/* /var/www/site-available/monSite
```
2. Install Dependencies
Once inside the project directory, run the following command to install all required dependencies:

```bash
npm install bcrypt express
```
3. Configure the Database
Ensure that PostgreSQL is properly configured and accessible. Edit the configuration file (e.g., config.js) to include your database connection parameters.

4. Start the Server
Start the server using the following command:

```bash
node server.js
```
5. Access the Site
Open your browser and navigate to the following address:
http://localhost:8888/monSite/

Example NGINX Configuration
Add a configuration similar to the one below to your NGINX configuration file:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /static/ {
        root /path/to/your/static/files;
    }
}
```
About
This project was developed as part of an advanced web development course, aiming to apply modern backend and frontend development concepts.





# B2IN_Projet_Web

Ce projet consiste à développer un site Internet pour une entreprise spécialisée dans la location de salles pour divers événements : séminaires, fêtes de Noël, anniversaires, formations, etc.

## Fonctionnalités principales
- Développement et utilisation d'une API REST en JavaScript pour communiquer avec une base de données PostgreSQL.
- Configuration et utilisation d'un serveur NGINX pour répondre aux besoins du site.

---

## Prérequis
Avant de démarrer, assurez-vous d'avoir installé les outils suivants :
- [Node.js](https://nodejs.org/) : Version 16 ou supérieure
- [PostgreSQL](https://www.postgresql.org/) : Une instance de base de données fonctionnelle
- [NGINX](https://nginx.org/) : Pour la configuration du serveur proxy

---

## Dépendances principales
Le projet utilise les bibliothèques suivantes :
- [Express](https://expressjs.com/) : Framework web pour Node.js
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) : Bibliothèque pour le hachage sécurisé des mots de passe

Pour installer toutes les dépendances, exécutez la commande suivante après avoir cloné le dépôt :  
```bash
npm install
```
Étapes d'installation et d'utilisation
1. Cloner le dépôt
Clonez ce repository sur votre machine locale :

```bash
git clone https://github.com/Caotox/B2IN_Projet_Web
```
1.1 Créer un fichier pour le site  
Après avoir cloné le dépôt, créez un fichier de configuration pour votre site :  
```bash
sudo touch /var/www/site-available/monSite
```

1.2 Copier les fichiers du projet
Copiez tous les fichiers du projet dans le répertoire créé :

```bash
sudo cp -r B2IN_Projet_Web/* /var/www/site-available/monSite
```

2. Installer les dépendances
Une fois dans le répertoire du projet, exécutez la commande suivante pour installer toutes les dépendances nécessaires :

```bash
npm install bycrypt express
```
3. Configurer la base de données
Assurez-vous que PostgreSQL est configuré et accessible. Modifiez le fichier de configuration (par exemple, config.js) pour inclure vos paramètres de connexion.

4. Lancer le serveur
Démarrez le serveur avec la commande suivante :

```bash
node server.js
```
5. Accéder au site
Ouvrez votre navigateur et accédez à l'adresse suivante :
http://localhost:8888/monSite/

Configuration NGINX (exemple)
Ajoutez une configuration similaire à celle-ci dans votre fichier NGINX :

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /static/ {
        root /path/to/your/static/files;
    }
}
```
À propos
Ce projet a été réalisé dans le cadre d'un cours sur le développement web avancé, visant à appliquer des concepts modernes de développement backend et frontend.
