// Importation des modules nécessaires
const express = require('express');
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe
const { Pool } = require('pg');    // Client PostgreSQL

const app = express();
const pool = new Pool({
    user: 'utilisateur',   // Remplacer par notre nom d'utilisateur       
    host: 'localhost',                
    database: 'base_de_donnees', // Remplacer par le nom de notre BDD
    password: 'mot_de_passe',     // Idem pour le mdp
    port: 5432,                        
  });
  

// Middleware pour lire les données JSON
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

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion du nouvel utilisateur
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
      // Vérifier si l'email existe dans la base de données
      const userQuery = 'SELECT * FROM users WHERE adresse_mail = $1';
      const user = await pool.query(userQuery, [adresse_mail]);
  
      if (user.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
      }
  
      // Vérifier si le mot de passe correspond
      const validPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);
  
      if (!validPassword) {
        return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
      }
  
      res.status(200).json({ success: true, message: 'Connexion réussie' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  });

// Route pour récupérer toutes les salles
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

// Route pour réserver une salle
app.post('/api/reservation', async (req, res) => {
  const { email, salle_id, date, heure } = req.body; 

  try {
    const insertReservationQuery = `
      INSERT INTO reservations (email, salle_id, date, heure)
      VALUES ($1, $2, $3, $4) RETURNING *`;
      
    const newReservation = await pool.query(insertReservationQuery, [email, salle_id, date, heure]);

    res.status(201).json({ success: true, message: 'Réservation réussie', reservation: newReservation.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la réservation' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
