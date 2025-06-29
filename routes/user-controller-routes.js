const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  userAvailability,
  getUser,
  createUser,
  validateToken,
} = require("../controllers/user-controller");

router.post("/validate-token", validateToken);
router.post("/login", getUser);
router.get("/:email/taken", userAvailability);
router.post("/register", createUser);

module.exports = router;
