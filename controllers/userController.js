const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const passport = require('../passport-config')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

/*GET login*/
exports.login_get = function (req, res, next) {
  res.render('log-in', { isAuthenticated: req.isAuthenticated() })
}
/*POST login*/
exports.login_post = passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login'
})

/*GET logout*/
exports.logout = function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

/*GET SIGNUP*/
exports.signup_get = function (req, res) {
  res.render("sign-up-form")
}

/*POST Signup*/
exports.signup_post = [
  //insert validation and sanitizing
  asyncHandler(async (req, res, next) => {
    const hashedPassword= await bcrypt.hash(req.body.password,10)
    try {
      const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password:hashedPassword, 
        member: false,
        admin: false
      });
   
      await user.save();
      res.redirect("/sign-up");

    } catch (err) {
      return next(err);
    };
  })
]

