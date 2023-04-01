const { db } = require('./db');

const myModel = {
  getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM projet', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  add(name) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO projet (nom) VALUES (?)', [name], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  update(id, name) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE projet SET nom = ? WHERE id = ?', [name, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM projet WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
};

module.exports = myModel;
