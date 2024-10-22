const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Si tu souhaites hacher les mots de passe
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
    user: 'postgres', // Nom d'utilisateur de PostgreSQL
    host: 'localhost',
    database: 'monSiteDB', // Nom de ta base de données
    password: 'ton_mot_de_passe', // Remplace par ton mot de passe
    port: 5432,
});

app.use(bodyParser.json());

// Route d'inscription
app.post('/api/inscription', async (req, res) => {
    const { prenom, nom, email, mot_de_passe } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const result = await pool.query(
            'INSERT INTO users (prenom, nom, adresse_mail, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING *',
            [prenom, nom, email, hashedPassword]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

// Route de connexion
app.post('/api/connexion', async (req, res) => {
    const { email, mot_de_passe } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE adresse_mail = $1',
            [email]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
            if (match) {
                res.status(200).json({ message: 'Connexion réussie!' });
            } else {
                res.status(401).json({ message: 'Mot de passe incorrect.' });
            }
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erreur lors de la connexion.' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
