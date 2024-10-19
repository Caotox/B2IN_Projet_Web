const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json()); 

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reservation_salles',
  password: 'password',
  port: 5432,
});

// Inscription d'un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  const { prenom, nom, adresse_mail, mot_de_passe } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (prenom, nom, adresse_mail, mot_de_passe) VALUES ($1, $2, $3, $4)',
      [prenom, nom, adresse_mail, hashedPassword]
    );
    res.status(201).send('Utilisateur créé avec succès');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

// Connexion utilisateur
app.post('/api/login', async (req, res) => {
  const { adresse_mail, mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE adresse_mail = $1', [adresse_mail]);
    if (result.rows.length === 0) {
      return res.status(400).send('Utilisateur non trouvé');
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) {
      return res.status(400).send('Mot de passe incorrect');
    }
    res.status(200).send('Connexion réussie');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la connexion');
  }
});

// Réservation d'une salle avec date et heure
app.post('/api/reserver', async (req, res) => {
  const { adresse, date, time, info } = req.body;
  try {
    // Ici, tu peux soit supprimer la salle de la base de données, soit simplement la marquer comme réservée
    const result = await pool.query(
      'DELETE FROM salles WHERE adresse = $1',
      [adresse]
    );
    // await pool.query('INSERT INTO reservations (adresse, date, time, info) VALUES ($1, $2, $3, $4)', [adresse, date, time, info]);

    res.status(200).send('Salle réservée avec succès');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la réservation');
  }
});

app.listen(port, () => {
  console.log(`API REST démarrée sur http://localhost:${port}`);
});
