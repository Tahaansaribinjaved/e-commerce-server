const express = require('express');
const { sendEmailNotification } = require('../controllers/emailController');

const router = express.Router();

router.post('/send', sendEmailNotification);

module.exports = router;
