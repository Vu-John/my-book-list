const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gBookSchema = new Schema({
    gBookId: String,
    userId: String,
});

module.exports = mongoose.model('GBook', gBookSchema);