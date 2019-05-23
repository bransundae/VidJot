const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Load User Model
require('../models/User');
const Idea = mongoose.model('ideas');

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

module.exports = router;