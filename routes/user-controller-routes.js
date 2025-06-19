const express = require('express');
const router = express.Router({ mergeParams: true });

const { getUser, createUser } = require('../controllers/user-controller');

router.post('/login', getUser);
router.post('/register', createUser);

module.exports = router;