const mongoose= require("mongoose");

mongoose.connect('mongodb://localhost/notes-db-app')
    .then(db => console.log('Db is conected'))
    .catch(err => console.log(err))