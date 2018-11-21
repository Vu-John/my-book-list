const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for book
const bookSchema = new Schema({
    // describe different data types and properties we expect in our book
    name: String,
    genre: String,
    authorId: String,
});

// making a collection/model which is going to be book and this collection in the db is going to look like bookSchema
// we export and later on we will be using this model to interact with our db
module.exports = mongoose.model('Book', bookSchema);