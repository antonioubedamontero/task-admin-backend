const express = require('express');
const router = express.Router({ mergeParams: true });

const { getUser, createUser } = require('../controllers/auth-controller');

router.post('/login', getUser);
router.post('/signing', createUser);

module.exports = router;