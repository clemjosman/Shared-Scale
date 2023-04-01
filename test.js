const myModel = require('./myModel');

myModel.getAll()
  .then(rows => {
    console.log(rows);
  })
  .catch(err => {
    console.error(err);
  });

myModel.add('Projet 4')
  .then(() => {
    console.log('Nouveau projet ajouté');
  })
  .catch(err => {
    console.error(err);
  });

myModel.update(2, 'Nouveau nom')
  .then(() => {
    console.log('Projet mis à jour');
  })
  .catch(err => {
    console.error(err);
  });

myModel.delete(3)
  .then(() => {
    console.log('Projet supprimé');
  })
  .catch(err => {
    console.error(err);
  });
