# ncd /etc/nginx/sites-available.
# touch monSite
# nano monSite --> mettre ce fichier

# Placer les fichiers HTML et CSS (comme index.html) dans le dossier /var/www/monSite.

# sudo chown -R www-data:www-data /var/www/monSite
# sudo chmod -R 755 /var/www/monSite

# sudo nano /etc/nginx/nginx.conf
# Vérifier que user www-data; est présente
# dans la section http, ajouter include /etc/nginx/sites-available/monSite;
# commenter # include /etc/nginx/sites-enabled/*;
# Faire : sudo ln -s /etc/nginx/sites-available/monSite /etc/nginx/sites-enabled/ (lien entre le fichier de configuration NGINX)
# Redémarrer NGINX : sudo systemctl restart nginx
# Exécuter le serveur : node server.js
# Pour tester le site : Ouvre un navigateur et accède à : http://localhost/monSite/index.html
# Pour l'API, utilise Postman ou accède à : http://localhost/api/
