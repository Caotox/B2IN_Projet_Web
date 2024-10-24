const express = require('express');
const bcrypt = require('bcrypt');  
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

const pool = new Pool({
  user: 'postgres',               
  host: 'localhost',              
  database: 'b2in_projet_web_bdd', 
  password: 'root',               
  port: 5432,                     
});


app.use(cors({
  origin: 'http://localhost'
}));

  
app.use(express.json());

app.post('/api/inscription', async (req, res) => {
  const { prenom, nom, adresse_mail, mot_de_passe } = req.body;

  try {
    const userExistsQuery = 'SELECT * FROM users WHERE adresse_mail = $1';
    const userExists = await pool.query(userExistsQuery, [adresse_mail]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);


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
  console.log(adresse_mail);

  try {
    const userQuery = 'SELECT * FROM users WHERE adresse_mail = $1';
    const userResult = await pool.query(userQuery, [adresse_mail]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
    }

    const user = userResult.rows[0];

    // Comparer le mot de passe haché
    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
    }

    res.status(200).json({ success: true, message: 'Connexion réussie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
  }
});

/*
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
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur : ${PORT}`);
});
