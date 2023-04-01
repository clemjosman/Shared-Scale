import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Project.css";
import io from "socket.io-client";

const Projet = () => {
  const { projet } = useParams();
  const projetname = projet.toLowerCase().replace(/\s+/g, "");

  const grilleNotation = {
    rtype: [
      { critere: "Le cmake est fonctionnel", notes: [0, 1, 2] },
      { critere: "Le projet compile", notes: [0, 1, 2] },
    ],
    area: [
      { critere: "Pertinance de la Stack Technique", notes: [0, 1] },
      { critere: "Le nombre de services est respecté", notes: [0, 1] },
    ],
    projet3: [
      { critere: "pas d'inspi", notes: [0, 1] },
      { critere: "pas d'inspi", notes: [0, 1] },
    ],
  };

  const grille = grilleNotation[projetname] || [];

  const [notes, setNotes] = useState(
    grille.reduce((acc, cur) => {
      acc[cur.critere] = Array(cur.notes.length).fill(false);
      return acc;
    }, {})
  );
  const [commentaire, setCommentaire] = useState("");
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  // connexion à l'instance de socket.io sur le serveur
  //   const socket = io("http://localhost:6868");

  //   useEffect(() => {
  //     // écoute de l'événement commentaireAdded envoyé depuis le serveur
  //     socket.on("commentaireAdded", (commentaire) => {
  //       setNotes(commentaire);
  //     });
  //   }, [socket]);

  const handleNoteSelection = (critere, noteIndex) => {
    const newNotes = { ...notes };
    newNotes[critere] = newNotes[critere].map((note, index) => {
      return index === noteIndex ? true : false;
    });
    setNotes(newNotes);
  };

  const handleCommentaireChange = (event) => {
    setCommentaire(event.target.value);
    // émission de l'événement commentaireAdded au serveur
    // socket.emit("commentaireAdded", event.target.value);
  };
  useEffect(() => {
    // db.all(
    //   `SELECT * FROM commentaires WHERE projet = ?`,
    //   [projetname],
    //   (err, rows) => {
    //     if (err) {
    //       console.error(err.message);
    //     } else {
    //       setCommentaires(rows);
    //     }
    //   }
    // );
  }, []);

  const handleSubmit = () => {
    const notesToSend = grille.flatMap((critere) => {
      return critere.notes
        .map((note, index) => {
          if (notes[critere.critere][index]) {
            return { critere: critere.critere, note: note };
          }
          return null;
        })
        .filter((note) => note !== null);
    });
    const dataToSend = {
      notes: notesToSend,
      commentaire: commentaire,
    };
    console.log(dataToSend);
    // db.serialize(() => {
    //   db.run(
    //     `INSERT INTO commentaires (projet, notes, commentaire) VALUES (?, ?, ?)`,
    //     [projetname, JSON.stringify(notesToSend), commentaire],
    //     (err) => {
    //       if (err) {
    //         console.error(err.message);
    //       } else {
    //         console.log("Commentaire inséré avec succès");
    //       }
    //     }
    //   );
    // });
  };

  return (
    <div className="projet-container">
      <h1 className="projet-title">{projet}</h1>
      <p className="projet-subtitle">
        Grille de notation pour le projet {projet} ici.
      </p>
      {grille.length > 0 ? (
        <table className="projet-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {grille.map((critere, index) => (
              <tr key={index}>
                <td>{critere.critere}</td>
                <td>
                  {critere.notes.map((note, noteIndex) => (
                    <label key={noteIndex} className="note-label">
                      <input
                        type="radio"
                        name={critere.critere}
                        value={note}
                        checked={notes[critere.critere][noteIndex]}
                        onChange={() =>
                          handleNoteSelection(critere.critere, noteIndex)
                        }
                      />
                      {note}
                    </label>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="projet-subtitle">
          Aucune grille de notation pour le projet {projet} ici.
        </p>
      )}

      <div className="projet-commentaire">
        <label htmlFor="commentaire" className="projet-label">
          Commentaire
        </label>
        <textarea
          id="commentaire"
          name="commentaire"
          value={commentaire}
          onChange={handleCommentaireChange}
          className="projet-textarea"
        />
        <button className="projet-submit" onClick={handleSubmit}>
          Soumettre
        </button>
      </div>
      {/* <div>
        {commentaire.map((commentaire) => (
          <div key={commentaire.id} className="projet-commentaire">
            <div className="projet-notes">
              {JSON.parse(commentaire.notes).map((note) => (
                <p key={note.critere}>
                  {note.critere}: {note.note}
                </p>
              ))}
            </div>
            <p>{commentaire.commentaire}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Projet;
