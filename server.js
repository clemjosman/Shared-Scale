const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT || 6969;
const app = express();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database.");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE projets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER,
      nom TEXT UNIQUE,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE commentaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projet_id INTEGER,
      projet TEXT,
      notes TEXT,
      commentaire TEXT,
      FOREIGN KEY (projet) REFERENCES projets (nom)
    )
  `);
  db.run(
    `INSERT INTO projets (nom, description) VALUES (?, ?)`,
    ["rtype", "Description du projet 1"],
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
  db.run(
    `INSERT INTO projets (nom, description) VALUES (?, ?)`,
    ["area", "Description du projet 2"],
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
  db.run(
    `INSERT INTO projets (nom, description) VALUES (?, ?)`,
    ["Projet 3", "Description du projet 3"],
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
});

app.use(express.json());
app.use(express.static("client/build"));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/data", (_, res) => {
  res.send([(msg = "This is the test message")]);
});

app.get("/projets", (_, res) => {
  db.all("SELECT id, nom, description FROM projets", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const projets = rows.map((row) => ({
        id: row.id,
        nom: row.nom,
        description: row.description,
      }));
      res.json(projets);
    }
  });
});

app.get("/projets/:nom", (req, res) => {
  const nom = req.params.nom;
  db.get("SELECT id FROM projets WHERE nom = ?", [nom], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.status(404).send(`Le projet "${nom}" n'existe pas.`);
    } else {
      res.json(row);
    }
  });
});


app.get("/api/commentaires", (req, res) => {
  db.all("SELECT * FROM commentaires", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const commentaires = rows.map((row) => ({
        id: row.id,
        projet: row.projet,
        notes: JSON.parse(row.notes),
        commentaire: row.commentaire,
      }));
      res.json(commentaires);
    }
  });
});


app.post("/api/notes", (req, res) => {
  const projetName = req.body.projet;
  const notesToSend = req.body.notes;
  const commentaire = req.body.commentaire;

  db.run(
    `INSERT INTO commentaires (projet, notes, commentaire) VALUES (?, ?, ?)`,
    [projetName, JSON.stringify(notesToSend), commentaire],
    (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.get('/api/commentaires/projet/:nom', (req, res) => {
  const nom = req.params.nom;
  db.all("SELECT * FROM projets WHERE nom = ?", [nom], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (rows.length === 0) {
      res.status(404).send(`Projet ${nom} introuvable`);
    } else {
      const projet_id = rows[0].id;
      db.all("SELECT * FROM commentaires WHERE projet_id = ?", [projet_id], (err, rows) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json(rows);
        }
      });
    }
  });
});


app.post('/api/commentaire', (req, res) => {
  db.all("SELECT * FROM projets WHERE nom = ?", [req.body.projet], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    } else {
      const project = rows[0];
      console.log(project);
      db.all("SELECT * FROM commentaires WHERE projet_id = ?", [project.id], (err, rows) => {
        if (err) {
          return res.status(500).send(err.message);
        } else {
          if (rows.length === 0) {
            db.run(
              `INSERT INTO commentaires (projet_id, projet, notes, commentaire) VALUES (?, ?, ?, ?)`,
              [project.id, project.nom, JSON.stringify(req.body.notes), req.body.commentaire],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err.message);
                } else {
                  return res.sendStatus(200);
                }
              }
            );
          } else {
            db.all("UPDATE commentaires SET notes = ?, commentaire = ? WHERE projet_id = ?", [JSON.stringify(req.body.notes), req.body.commentaire, project.id], (err, rows) => {
              if (err) {
                return res.status(500).send(err.message);
              } else {
                return res.sendStatus(200);
              }
            });
          }
        }
      });
    }
  });
});


app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const server = http.createServer(app); // Créez une instance de serveur HTTP
// const io = socketIO(server); // Passez l'instance de serveur à Socket.IO

// io.on("connection", (socket) => {
//   console.log(
//     `User connected with ID ${socket.id} and IP address ${socket.handshake.address}`
//   );

//   socket.on("commentaireAdded", (commentaire) => {
//     db.run(
//       "INSERT INTO commentaire(title, content) VALUES (?, ?)",
//       [commentaire.title, commentaire.content],
//       (err) => {
//         if (err) {
//           console.error(err.message);
//         }
//         console.log("New commentaire added:", commentaire);
//         io.emit("commentaireAdded", commentaire);
//       }
//     );
//   });
// });

server.listen(PORT, () => {
  console.log("Serveur démarré sur le port", PORT);
});

module.exports = db;
