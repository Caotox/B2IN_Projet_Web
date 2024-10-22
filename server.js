const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Créer une connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reservation_salles'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

const app = express();
app.use(bodyParser.json());

// Inscription d'un utilisateur
app.post('/api/register', async (req, res) => {
    const { prenom, nom, adresse_mail, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const queryCheck = 'SELECT * FROM users WHERE adresse_mail = ?';
    db.query(queryCheck, [adresse_mail], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer le nouvel utilisateur
        const query = 'INSERT INTO users (prenom, nom, adresse_mail, mot_de_passe) VALUES (?, ?, ?, ?)';
        db.query(query, [prenom, nom, adresse_mail, hashedPassword], (err, result) => {
            if (err) throw err;
            res.status(201).json({ message: 'Inscription réussie' });
        });
    });
});

// Connexion d'un utilisateur
app.post('/api/login', (req, res) => {
    const { adresse_mail, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe et que le mot de passe est correct
    const query = 'SELECT * FROM users WHERE adresse_mail = ?';
    db.query(query, [adresse_mail], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            // Comparer le mot de passe avec celui stocké
            const user = result[0];
            const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

            if (isMatch) {
                res.json({ message: 'Connexion réussie' });
            } else {
                res.status(400).json({ message: 'Email ou mot de passe incorrect' });
            }
        } else {
            res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
