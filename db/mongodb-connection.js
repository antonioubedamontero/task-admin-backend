const mongoose = require('mongoose');
require('dotenv').config(); // Load variables from .env

const { USER_DB, PASSWORD_DB, DB_NAME} = process.env;
const DB_CONNECTION_STRING = `mongodb+srv://${USER_DB}:${PASSWORD_DB}@taskmanager0.zgfxtfa.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const connectMongoDb = () => {
    mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('🟢 Connected to database');
    })
    .catch(err => {
      console.error('🔴 Connection error:', err);
    });
};

module.exports = connectMongoDb;
;