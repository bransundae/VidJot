const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login User
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/users/login');
});

//Add User
router.post('/register', (req, res) =>{
    let errors = [];

    if (!req.body.name)
        errors.push({text:"Name cannot be empty"});
    if (!req.body.email)
        errors.push({text:"Email cannot be empty"});
    if (!req.body.password)
        errors.push({text:"Password cannot be empty"});
    if (!req.body.password_confirm)
        errors.push({text:"Must Confirm password"});
    if (req.body.password != req.body.password_confirm)
        errors.push({text: "Passwords must match"});
    if (req.body.password.length < 4)
        errors.push({text: "Password must be at least 4 characters"})
    if (errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    } else{
        User.findOne({email: req.body.email})
        .then(user => {
            if (user){
                errors.push({text:'This email is already registered'})
                res.render('users/register', {
                    errors: errors,
                    name: req.body.name
                });
            }
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        const newUser = {
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        }
                        console.log(newUser);
                        new User(newUser)
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'Registration Succesful');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                return;
                            });
                    });
                });
            }
        });
    }
});

module.exports = router;