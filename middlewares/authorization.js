const { getDecodedToken } = require('../helpers/json-webtokens');

const validateAuthorization = (req, res, next) => {
    // Authorization: Bearer XXXXXXX
    const { authorization } = req.headers;
    const token = authorization?.slice(7);

    try {
      const id = getDecodedToken(token)?.payload || null;

      if (!id) {
        return res.status(403).send(
          { message: 'wrong credentials' }
        );
      }

      req.id = id;
      next();

    } catch(error) {
      console.error('🔴 Error validating credentials:', error);
      return res.status(403).send(
        { message: 'wrong credentials' }
      );     
    }
}

module.exports = validateAuthorization;
