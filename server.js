const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT || 6868;
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
      nom TEXT UNIQUE,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE commentaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projet TEXT,
      notes TEXT,
      commentaire TEXT,
      FOREIGN KEY (projet) REFERENCES projets (nom)
    )
  `);
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
  fs.readFile("project.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur interne du serveur");
      return;
    }

    const projets = JSON.parse(data);
    res.json(projets.projectNames);
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
