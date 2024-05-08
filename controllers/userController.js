const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const passport = require('../passport-config')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
require('dotenv').config()

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
    function checkAdminKey(adminkey) {
      if (adminkey === process.env.ADMIN_KEY) {
        return true
      } else {
        return false
      }
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
      const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        member: false,
        admin: checkAdminKey(req.body['admin-key'])
      });

      await user.save();
      res.redirect("/login");

    } catch (err) {
      return next(err);
    };
  })
]

