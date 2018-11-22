const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

// ENV variables
require('dotenv').config();

const app = express();

// allow cross-origin requests
app.use(cors());

mongoose.connect(process.env.MLAB_URL);
mongoose.connection.once('open', () => {
    console.log('connected to databse');
});

app.use('/graphql', graphqlHTTP({
    schema, // using ES6 --> instead of schema: schema
    graphiql: true
}));

app.listen(3001, () => {
    console.log('listening to requests on port 3001');
})