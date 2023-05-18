const express = require('express');
const validate_token = require('../modules/auth/validate_token');
const login = require('../modules/auth/login');
const register = require('../modules/auth/register');
const trends = require('../modules/trends');

const router = express.Router();


router.get('/', validate_token, (req, res)=>{
    res.user ? res.redirect('/dashboard') : res.redirect('/login');
});

router.get('/login', validate_token, (req, res)=>{
    req.user ? res.redirect('/dashboard') : res.render('login', {error: null});
});

router.get('/register', validate_token, (req, res)=>{
    req.user ? req.user.role === "admin" ?  res.render('register', {error: null, user: req.user, success: null}) : res.redirect('dashboard') : res.redirect('login');
});

router.get('/dashboard', validate_token, (req, res)=>{
    req.user ? res.render('dashboard', {user: req.user}) : res.redirect('/login');
});

router.get('/logout', validate_token, (req, res)=>{
    if(req.user){
        res.clearCookie('token');
    }
    res.redirect('login');
});
router.get('/trends', validate_token, (req, res)=>{
    req.user ? res.render('trends', {user: req.user}) : res.redirect('/login');
})


router.get('/get_trends', validate_token, trends);
router.post('/login', validate_token, login);
router.post('/register', validate_token, register);


module.exports = router;