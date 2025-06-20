const bcrypt = require('bcrypt');
require('dotenv').config(); // Load vars from .env

const SALT = process.env.BCRYPT_SALT;

const codePassword = (password) => bcrypt.hashSync(password, SALT);
const isValidPassword = (passwordToCheck, encryptedPassword) => bcrypt.compareSync(passwordToCheck, encryptedPassword);

module.exports = {
    codePassword,
    isValidPassword
}