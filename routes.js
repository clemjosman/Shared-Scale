const express = require('express');
const router = express.Router();
const { insertProjet } = require('./db');

router.post('/projets', (req, res) => {
  const { nom, description } = req.body;
  insertProjet(nom, description);
  res.sendStatus(201);
});

router.get('/projets', (req, res) => {
    const projets = ['Projet 1', 'Projet 2', 'Projet 3'];
    res.json(projets);
  });

router.post('/notes', (req, res) => {
    const nouvelleNote = req.body;
    // Code pour ajouter la nouvelle note à la base de données
    res.sendStatus(201); // Renvoyer un statut 201 pour indiquer que la ressource a été créée avec succès
  });

router.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteModifiee = req.body;
    // Code pour mettre à jour la note correspondante dans la base de données
    res.sendStatus(204); // Renvoyer un statut 204 pour indiquer que la ressource a été mise à jour avec succès
  });

router.get('/notes', (req, res) => {
    db.all('SELECT * FROM notes', (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });

module.exports = router;
