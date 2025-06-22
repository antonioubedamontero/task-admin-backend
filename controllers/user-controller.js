const User = require('../db/schemas/user-schema');
const { codePassword, isValidPassword } = require('../helpers/password-encription');
const { generateToken } = require('../helpers/json-webtokens');

const getUser = async(req,res) => {
    const { email, password } = req.body;

    try {
      const userFound = await User.findOne({ email });

      if(!userFound) {
        return res.status(401).json(
          { message: 'User not authorized'}
        );
      }

      const isPasswordOk = isValidPassword(password, userFound.password);

      if (!isPasswordOk) {
        return res.status(401).json(
          { message: 'User not authorized'}
        );
      }

      const { password:passwd, __v ,...userData } = userFound.toJSON();

      // Generate a new token to keep session alive
      res.status(200).json({
        user: {
          ...userData
        },
        token: generateToken(userFound._id)
      });
      
    } catch (error) {
      console.error('🔴 Error getting user:', error);
      return res.status(500).json(
        { message: 'Internal server error' }
      );      
    }
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

      const { password:passwd, __v, ...userData } = user.toJSON();

      await user.save();

      return res.status(201).json({
        user: {
          ...userData
        },
        token: generateToken(user._id) 
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