const { getDecodedToken } = require("../helpers/json-webtokens");

const validateAuthorization = (req, res, next) => {
  // Authorization: Bearer XXXXXXX
  const { authorization } = req.headers;

  const i18n = req.t;

  if (!authorization) {
    return res.status(403).json({
      message: i18n("authorizationErrors.missingToken"),
    });
  }

  const token = authorization.slice(7);

  const userId = getDecodedToken(token)?.payload ?? null;

  if (!userId) {
    return res
      .status(403)
      .send({ message: i18n("authorizationErrors.invalidToken") });
  }

  req.userId = userId;
  next();
};

module.exports = validateAuthorization;
