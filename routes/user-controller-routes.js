const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  loginRequiredFields,
  validateTokenRequiredFields,
  userAvailabilityRequiredFields,
  registerRequiredFields,
} = require("../middlewares/user-required-fields");

const {
  userAvailability,
  login,
  register,
  validateToken,
} = require("../controllers/user-controller");

router.post("/validate-token", [validateTokenRequiredFields], validateToken);
router.post("/login", [loginRequiredFields], login);
router.get("/:email/taken", [userAvailabilityRequiredFields], userAvailability);
router.post("/register", [registerRequiredFields], register);

module.exports = router;
