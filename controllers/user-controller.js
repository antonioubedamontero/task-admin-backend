const User = require('../db/schemas/user-schema');
const { codePassword, isValidPassword } = require('../helpers/password-encription');

const getUser = async(req,res) => {
    const { email, password } = req.body;

    try {
      const userFound = await User.findOne({ email });
      const isPasswordOk = isValidPassword(password,userFound.password);

      if (!userFound || !isPasswordOk) {
        return res.status(401).json(
          { message: 'User not authorized'}
        );
      }

      const { password:passwd, __v ,...userData } = userFound.toJSON();

      // TODO: Include sending token to user and renew token endpoint
      res.status(200).json({
        user: {
          ...userData
        },
        token: 'mock token'
      });
      
    } catch (error) {
      console.error('🔴 Error getting user:', error);
      return res.status(500).json(
        { message: 'Internal server error' }
      );      
    }

    const userFound = usersMock.find(user => user.email === email && user.password === password);

    if (!userFound) {
      return res.status(404).json({ message: 'User not found'});
    }

    const { password: passwdFnd, __v, ...rest } = userFound.toJSON(); 
    res.status(200).json({ ...rest });
};

const createUser = async(req,res) => {
    try {
      const { email, password, name, surname } = req.body;

      const userFound = await User.findOne({ email });

      if (userFound) {
        return res.status(409).json(
          { message: 'User already exists'}
        );
      }

      const user = new User({ email, password, name, surname });
      user.password = codePassword(password);
      await user.save();

      const { password:passwd, __v, ...userData } = user.toJSON();

      return res.status(201).json({
        ...userData
      });

    } catch (error) {
     console.error('🔴 Error creating user:', error);
     return res.status(500).json(
      { message: 'Internal server error' }
     ); 
    }
};

module.exports = {
    getUser,
    createUser
}