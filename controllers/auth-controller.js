const { v4: uuidv4 } = require('uuid');

// TODO: This is a mock implementation
const usersMock = require('../mocks/users');

const getUser = (req,res) => {
    const { email, password } = req.body;

    const userFound = usersMock.find(user => user.email === email && user.password === password);

    if (!userFound) {
      return res.status(404).json({ message: 'User not found'});
    }

    const { password: passwdFnd, ...rest } = userFound; 
    res.status(200).json({ ...rest });
};

const createUser = (req,res) => {
    const { email, password, name, surname } = req.body;

    const userFound = usersMock.find(user => user.email === email && user.password === password);

    if (userFound) {
      return res.status(409).json({ message: 'User already exists'});
    }

    const id = uuidv4();
    usersMock.push({id, email, password, name, surname });

    res.status(201).json({ message: 'user created'});
};

module.exports = {
    getUser,
    createUser
}