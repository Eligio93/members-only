const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const passport = require('../passport-config')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
require('dotenv').config()

/*GET login*/
exports.login_get = function (req, res, next) {
  const logInMessage=req.session.messages
  req.session.messages=[]
  res.render('log-in', { isAuthenticated: req.isAuthenticated(),logInMessage:logInMessage })
}
/*POST login*/
exports.login_post = passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage:true
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
    function checkAdmin(key){
      if(key===process.env.ADMIN_KEY){
        return true
      }
      return false
    }
    function checkMember(key){
      if(checkAdmin(key) || key=== process.env.MEMBER_KEY){
        return true
      }
      return false
    }


    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
      const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        member: checkMember(req.body["permission-key"]),
        admin: checkAdmin(req.body["permission-key"])
      });
      await user.save();
      res.redirect("/login");
    } catch (err) {
      return next(err);
    };
  })
]

