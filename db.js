const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

const createTable = () => {
  db.run('CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
};

function insertProjet(nom, description) {
  db.run('INSERT INTO projet(nom, description) VALUES(?, ?)', [nom, description], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Projet ${nom} inséré dans la base de données.`);
  });
}

module.exports = {
  db,
  insertProjet
};

// db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });

module.exports = { db, createTable };
