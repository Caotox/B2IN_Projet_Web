// Importation des modules nécessaires
const express = require('express');
// const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe
const { Pool } = require('pg');    // Client PostgreSQL

const app = express();
const pool = new Pool({
  user: 'postgres',               // Nom d'utilisateur
  host: 'localhost',              // Hôte
  database: 'B2IN_projet_web_bdd', // Nom de la base de données
  password: 'root',               // Mot de passe
  port: 5432,                     // Port
});

  
app.use(express.json());

app.post('/api/inscription', async (req, res) => {
  const { prenom, nom, adresse_mail, mot_de_passe } = req.body;

  try {
    // Vérifier si l'email existe déjà dans la base de données
    const userExistsQuery = 'SELECT * FROM users WHERE adresse_mail = $1';
    const userExists = await pool.query(userExistsQuery, [adresse_mail]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    // const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const hashedPassword = await mot_de_passe;

    // Insertion d'un nouvel utilisateur (méthode POST)
    const insertUserQuery = `
      INSERT INTO users (prenom, nom, adresse_mail, mot_de_passe)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const newUser = await pool.query(insertUserQuery, [prenom, nom, adresse_mail, hashedPassword]);

    res.status(201).json({ success: true, message: 'Inscription réussie', user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription' });
  }
});
app.post('/api/connexion', async (req, res) => {
    const { adresse_mail, mot_de_passe } = req.body;
  
    try {
      // Vérification de l'email dans la BDD
      const userQuery = 'SELECT * FROM users WHERE adresse_mail = $1';
      const user = await pool.query(userQuery, [adresse_mail]);
  
      if (user.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
      }
  
      // Vérification du mdp dans la BDD
      const validPassword = (mot_de_passe === user.rows[0].mot_de_passe);
  
      if (!validPassword) {
        return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
      }
  
      res.status(200).json({ success: true, message: 'Connexion réussie' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  });

// Récupération des salles (GET)
app.get('/api/salles', async (req, res) => {
  try {
    const sallesQuery = 'SELECT * FROM salles';
    const result = await pool.query(sallesQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des salles' });
  }
});

// Reservation d'une salle puis suppression (POST pour envoyer l'information de la salle, puis suppression de la salle)
app.post('/api/reservation', async (req, res) => {
  const { ville, adresse, prix, nb_personnes, type_espace } = req.body; 

  try {
    const insertReservationQuery = `
      INSERT INTO reservations (ville, adresse, prix, nb_personnes, type_espace)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      
    const newReservation = await pool.query(insertReservationQuery, [ville, adresse, prix, nb_personnes, type_espace]);

    res.status(201).json({ success: true, message: 'Réservation réussie', reservation: newReservation.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la réservation' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur : ${PORT}`);
});
