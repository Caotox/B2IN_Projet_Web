const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;


const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'test_projet', 
    password: 'mdp', 
    port: 5432, // Port de PostgreSQL (à modifier si nécessaire)
});

app.use(express.json());

// GET : Récupération des données de la table

app.get('/api/salles', async (req, res) => {
    try {
        // On sélectionne toutes les salles dans les trois tables
        const resultOrleans = await pool.query('SELECT * FROM Orleans');
        const resultParis = await pool.query('SELECT * FROM Paris');
        const resultLyon = await pool.query('SELECT * FROM Lyon');
        
        // On combine les résultats des trois tables
        const salles = {
            Orleans: resultOrleans.rows,
            Paris: resultParis.rows,
            Lyon: resultLyon.rows
        };

        res.json(salles); // On renvoie les salles sous forme de JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des salles' });
    }
});

//  POST : Ajout d'une salle dans une ville spécifique
app.post('/api/salles/:ville', async (req, res) => {
    const { ville } = req.params; // Récupérer le nom de la ville
    const { nom, adresse, type_espace, nombre_personne } = req.body; // Récupérer les données envoyées

    if (!nom || !adresse || !type_espace || !nombre_personne) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    // On vérifie que la ville soit valide (Orleans, Paris ou Lyon)
    const validVilles = ['Orleans', 'Paris', 'Lyon'];
    if (!validVilles.includes(ville)) {
        return res.status(400).json({ error: 'Ville non reconnue.' });
    }

    try {
        // On insère la salle dans la table correspondante à la ville
        const result = await pool.query(
            `INSERT INTO ${ville} (nom, adresse, type_espace, nombre_personne) VALUES ($1, $2, $3, $4) RETURNING *`,
            [nom, adresse, type_espace, nombre_personne]
        );

        res.status(201).json(result.rows[0]); // Renvoie la salle ajoutée
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la salle' });
    }
});

// DELETE : Suppression d'une salle dans une ville spécifique
app.delete('/api/salles/:ville/:id', async (req, res) => {
    const { ville, id } = req.params; // Récupérer la ville et l'ID de la salle

    // Vérifier que la ville soit valide (Orleans, Paris ou Lyon)
    const validVilles = ['Orleans', 'Paris', 'Lyon'];
    if (!validVilles.includes(ville)) {
        return res.status(400).json({ error: 'Ville non reconnue.' });
    }

    try {
        // On supprime la salle de la table correspondante à la ville
        await pool.query(`DELETE FROM ${ville} WHERE id_${ville.toLowerCase()} = $1`, [id]);
        res.json({ message: `Salle avec l'ID ${id} supprimée de ${ville}.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la salle' });
    }
});

// PUT : Mise à jour d'une salle dans une ville spécifique
app.put('/api/salles/:ville/:id', async (req, res) => {
    const { ville, id } = req.params;
    const { nom, adresse, type_espace, nombre_personne } = req.body;

    if (!nom || !adresse || !type_espace || !nombre_personne) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    // Vérifier que la ville soit valide (Orleans, Paris ou Lyon)
    const validVilles = ['Orleans', 'Paris', 'Lyon'];
    if (!validVilles.includes(ville)) {
        return res.status(400).json({ error: 'Ville non reconnue.' });
    }

    try {
        // Mise à jour de la salle dans la table correspondante à la ville
        const result = await pool.query(
            `UPDATE ${ville} SET nom = $1, adresse = $2, type_espace = $3, nombre_personne = $4 WHERE id_${ville.toLowerCase()} = $5 RETURNING *`,
            [nom, adresse, type_espace, nombre_personne, id]
        );
        res.json(result.rows[0]); // Renvoie la salle mise à jour
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la salle' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`API lancée sur http://localhost:${port}`);
});
