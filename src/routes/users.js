const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const passport = require('passport');

router.get('/users/signin', (req, res) =>{
   // res.send('Ingresando a la APP');
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req, res) =>{
   // res.send('Formulario para autentificacion');
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) =>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    console.log(req.body);
    if(name.length <= 0){
        errors.push({text: 'insert your name'});
    }
    if(password.length <= 4){
        errors.push({text: 'insert password with 5 characters or more'});
    }
    if(password != confirm_password){
        errors.push({text: 'password do not match'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
       const emailUser = await User.findOne({email: email});
       if(emailUser){
        req.flash('error_msg', 'the  Email is already in use');
        res.redirect('/users/signup');
       }
       const newUser = new User({name, email, password});
       newUser.password = await newUser.encryptPassword(password);
       await newUser.save();
       req.flash('success_msg', 'You are registered');
       res.redirect('/users/signin');
    }
})

/*router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});*/

router.get('/users/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

module.exports = router;