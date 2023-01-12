const express = require('express');

const { signup, login } = require('../controllers/auth.js');

const router = express.Router();

//This will send data from frontend to backend
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;